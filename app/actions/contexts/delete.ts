'use server'

import { del } from '@vercel/blob'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'
import { deleteOpenAIFile, removeFileFromVectorStore } from '@/lib/openai'

import { contexts, projects } from '@/schema'

import { and, eq } from 'drizzle-orm'

export const deleteContextsAction = async (id: string) => {
  try {
    const userId = await getUserId()

    // First get the file to get the URL for deletion
    const contextsResult = await db
      .select()
      .from(contexts)
      .where(and(eq(contexts.id, id), eq(contexts.userId, userId)))
      .limit(1)

    if (!contextsResult?.length) {
      throw new Error('Contexts not found')
    }

    const context = contextsResult[0]

    // If the URL is from Vercel Blob, delete it
    if (context.url.includes('public.blob.vercel-storage.com')) {
      await del(context.url)
    }

    // Remove from OpenAI vector store if it exists
    if (context.openaiUploadId && context.projectId) {
      // Get the project's vector store ID
      const projectResult = await db
        .select({ vectorStoreId: projects.vectorStoreId })
        .from(projects)
        .where(and(eq(projects.id, context.projectId), eq(projects.userId, userId)))
        .limit(1)

      if (projectResult?.length && projectResult[0].vectorStoreId) {
        // Remove from vector store (best effort)
        await removeFileFromVectorStore(projectResult[0].vectorStoreId, context.openaiUploadId)

        // Delete the file from OpenAI (best effort)
        await deleteOpenAIFile(context.openaiUploadId)
      }
    }

    // Delete from database
    await db.delete(contexts).where(and(eq(contexts.id, id), eq(contexts.userId, userId)))

    return { success: true }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to delete contexts')
    return { error: errorMessage, success: false }
  }
}
