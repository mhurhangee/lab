'use server'

import { del, put } from '@vercel/blob'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'
import { removeFileFromVectorStore, uploadMarkdownToVectorStore } from '@/lib/openai'

import { contexts, projects } from '@/schema'

import { and, eq } from 'drizzle-orm'

interface UpdateContextActionProps {
  id: string
  name?: string
  projectId?: string | null
  file?: File
  markdown?: string
}

export const updateContextAction = async ({
  id,
  name,
  projectId,
  file,
  markdown,
}: UpdateContextActionProps) => {
  try {
    const userId = await getUserId()

    // Get existing file
    const existingContextResult = await db
      .select()
      .from(contexts)
      .where(and(eq(contexts.id, id), eq(contexts.userId, userId)))
      .limit(1)

    if (!existingContextResult?.length) {
      throw new Error('Context not found')
    }

    const existingContext = existingContextResult[0]
    let updateData: Partial<typeof contexts.$inferInsert> = {
      updatedAt: new Date(),
    }

    // If updating the file content
    if (file) {
      // Delete old file from blob storage
      await del(existingContext.url)

      // Upload new file
      const blob = await put(file.name, file, {
        access: 'public',
        allowOverwrite: true,
      })

      updateData = {
        ...updateData,
        name: file.name,
        url: blob.url,
        size: file.size,
        type: file.type,
      }
    }

    // If only updating the name
    if (name && !file) {
      updateData.name = name
    }

    // If updating the project
    if (projectId !== undefined) {
      // Handle moving context between projects (vector stores)
      if (existingContext.openaiUploadId) {
        // Remove from old vector store if it had one
        if (existingContext.projectId) {
          const oldProjectResult = await db
            .select({ vectorStoreId: projects.vectorStoreId })
            .from(projects)
            .where(and(eq(projects.id, existingContext.projectId), eq(projects.userId, userId)))
            .limit(1)

          if (oldProjectResult?.length && oldProjectResult[0].vectorStoreId) {
            await removeFileFromVectorStore(
              oldProjectResult[0].vectorStoreId,
              existingContext.openaiUploadId
            )
          }
        }

        // Add to new vector store if projectId is provided
        if (projectId) {
          const newProjectResult = await db
            .select({ vectorStoreId: projects.vectorStoreId })
            .from(projects)
            .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
            .limit(1)

          if (newProjectResult?.length && newProjectResult[0].vectorStoreId) {
            // For URLs with markdown, re-upload the markdown
            if (existingContext.type === 'urls' && existingContext.parsedMarkdown) {
              const filename = `${existingContext.name}.md`
              const openaiResult = await uploadMarkdownToVectorStore(
                existingContext.parsedMarkdown,
                filename,
                newProjectResult[0].vectorStoreId
              )
              if (openaiResult.success) {
                updateData.openaiUploadId = openaiResult.fileId
              }
            }
            // For PDFs, we would need to re-upload the file (more complex, skip for MVP)
          }
        } else {
          // If removing from project, clear the OpenAI upload ID
          updateData.openaiUploadId = null
        }
      }

      updateData.projectId = projectId
    }

    if (markdown) {
      updateData.parsedMarkdown = markdown

      // If this is a URL context with markdown and it's associated with a project,
      // upload the markdown to OpenAI vector store
      if (
        existingContext.type === 'urls' &&
        existingContext.projectId &&
        !existingContext.openaiUploadId
      ) {
        const projectResult = await db
          .select({ vectorStoreId: projects.vectorStoreId })
          .from(projects)
          .where(and(eq(projects.id, existingContext.projectId), eq(projects.userId, userId)))
          .limit(1)

        if (projectResult?.length && projectResult[0].vectorStoreId) {
          const vectorStoreId = projectResult[0].vectorStoreId
          const filename = `${existingContext.name}.md`

          const openaiResult = await uploadMarkdownToVectorStore(markdown, filename, vectorStoreId)
          if (openaiResult.success) {
            updateData.openaiUploadId = openaiResult.fileId
          } else {
            console.error('Failed to upload markdown to OpenAI:', openaiResult.error)
          }
        }
      }
    }

    // Update database record
    const updatedContext = await db
      .update(contexts)
      .set(updateData)
      .where(and(eq(contexts.id, id), eq(contexts.userId, userId)))
      .returning()

    if (!updatedContext?.length) {
      throw new Error('Failed to update context')
    }

    return { context: updatedContext[0], success: true }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to update context')
    return { error: errorMessage, success: false }
  }
}
