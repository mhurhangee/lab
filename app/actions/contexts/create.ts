'use server'

import { put } from '@vercel/blob'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'
import { generateId } from '@/lib/id'
import { uploadFileToVectorStore } from '@/lib/openai'

import { contexts, projects } from '@/schema'

import { ContextsTypes } from '@/types/contexts'

import { and, eq } from 'drizzle-orm'

interface CreateContextActionProps {
  file: File
  projectId?: string
  type: ContextsTypes
}

export const createContextAction = async ({ file, projectId, type }: CreateContextActionProps) => {
  try {
    const userId = await getUserId()

    // Upload file to Vercel Blob
    const blob = await put(userId + '/' + file.name, file, {
      access: 'public',
      allowOverwrite: true,
    })

    let openaiFileId: string | undefined

    // If context is associated with a project, upload to OpenAI vector store
    if (projectId) {
      // Get the project's vector store ID
      const projectResult = await db
        .select({ vectorStoreId: projects.vectorStoreId })
        .from(projects)
        .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
        .limit(1)

      if (!projectResult?.length || !projectResult[0].vectorStoreId) {
        throw new Error('Project not found or vector store not initialized')
      }

      const vectorStoreId = projectResult[0].vectorStoreId

      // Upload to OpenAI based on context type
      if (type === 'pdfs') {
        // For PDFs, upload the file directly
        const openaiResult = await uploadFileToVectorStore(file, vectorStoreId)
        if (!openaiResult.success) {
          console.error('Failed to upload to OpenAI:', openaiResult.error)
          // Continue with creation but log the error
        } else {
          openaiFileId = openaiResult.fileId
        }
      } else if (type === 'urls') {
        // For URLs, we need the markdown content
        // This will be handled when the markdown is parsed and saved
        // For now, we'll skip the OpenAI upload and handle it in the update action
        console.log('URL context created, OpenAI upload will happen when markdown is parsed')
      }
    }

    // Save file metadata to database
    const contextRecord = await db
      .insert(contexts)
      .values({
        id: generateId(),
        userId,
        name: file.name,
        url: blob.url,
        size: file.size,
        type: type,
        fileType: file.type,
        projectId,
        openaiUploadId: openaiFileId,
      })
      .returning({ id: contexts.id })

    if (!contextRecord?.length) {
      throw new Error('Failed to create context record')
    }

    return { id: contextRecord[0].id, url: blob.url, success: true }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to upload context')
    return { error: errorMessage, success: false }
  }
}
