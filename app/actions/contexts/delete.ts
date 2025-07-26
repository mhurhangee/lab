'use server'

import { del } from '@vercel/blob'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { contexts } from '@/schema'

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

    // Delete from database
    await db.delete(contexts).where(and(eq(contexts.id, id), eq(contexts.userId, userId)))

    return { success: true }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to delete contexts')
    return { error: errorMessage, success: false }
  }
}
