'use server'

import { put } from '@vercel/blob'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'
import { generateId } from '@/lib/id'
import { uploadFileToVectorStore, uploadMarkdownToVectorStore } from '@/lib/openai'

import { contexts, projects } from '@/schema'

import { ContextsTypes } from '@/types/contexts'

import { and, eq } from 'drizzle-orm'

interface CreateContextActionProps {
  file?: File
  url?: string
  projectId?: string
  type: ContextsTypes
  // For URLs: scraped content
  metadata?: {
    title?: string
    markdown?: string
  }
}

export const createContextAction = async ({
  file,
  url,
  projectId,
  type,
  metadata,
}: CreateContextActionProps) => {
  try {
    const userId = await getUserId()

    let blobUrl: string
    let fileName: string
    let fileSize: number
    let fileType: string

    if (file) {
      // Handle file upload (PDFs)
      const blob = await put(userId + '/' + file.name, file, {
        access: 'public',
        allowOverwrite: true,
      })
      blobUrl = blob.url
      fileName = file.name
      fileSize = file.size
      fileType = file.type
    } else if (url && metadata) {
      // Handle URL with scraped content
      fileName = metadata.title || 'Untitled'
      blobUrl = url
      fileSize = metadata.markdown?.length || 0
      fileType = 'text/markdown'
    } else if (type === 'text-editor') {
      // Handle text editor
      fileName = 'Untitled'
      blobUrl = ''
      fileSize = 0
      fileType = 'text/plain'
    } else {
      throw new Error('Either file or url with metadata must be provided')
    }

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
      if (type === 'pdfs' && file) {
        // For PDFs, upload the file directly
        const openaiResult = await uploadFileToVectorStore(file, vectorStoreId)
        if (!openaiResult.success) {
          console.error('Failed to upload to OpenAI:', openaiResult.error)
          // Continue with creation but log the error
        } else {
          openaiFileId = openaiResult.fileId
        }
      } else if (type === 'urls' && metadata?.markdown) {
        // For URLs, upload the markdown content
        const openaiResult = await uploadMarkdownToVectorStore(
          metadata.markdown,
          fileName,
          vectorStoreId
        )
        if (!openaiResult.success) {
          console.error('Failed to upload URL markdown to OpenAI:', openaiResult.error)
          // Continue with creation but log the error
        } else {
          openaiFileId = openaiResult.fileId
        }
      }
    }

    // Save file metadata to database
    const contextRecord = await db
      .insert(contexts)
      .values({
        id: generateId(),
        userId,
        name: fileName,
        url: blobUrl,
        size: fileSize,
        type: type,
        fileType: fileType,
        projectId,
        openaiUploadId: openaiFileId,
        // Store parsed markdown for URLs
        parsedMarkdown: metadata?.markdown,
      })
      .returning({ id: contexts.id })

    if (!contextRecord?.length) {
      throw new Error('Failed to create context record')
    }

    return { id: contextRecord[0].id }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to upload context')
    return { error: errorMessage, success: false }
  }
}
