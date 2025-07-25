'use server'

import { del } from '@vercel/blob'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { and, eq } from 'drizzle-orm'

import { contexts } from '@/schema'

interface DeleteFileActionProps {
  id: string
}

export const deleteFileAction = async ({ id }: DeleteFileActionProps) => {
  try {
    const userId = await getUserId()

    // First get the file to get the URL for deletion
    const fileResult = await db
      .select()
      .from(contexts)
      .where(and(eq(contexts.id, id), eq(contexts.userId, userId)))
      .limit(1)

    if (!fileResult?.length) {
      throw new Error('File not found')
    }

    const file = fileResult[0]

    // Delete from Vercel Blob
    await del(file.url)

    // Delete from database
    await db.delete(contexts).where(and(eq(contexts.id, id), eq(contexts.userId, userId)))

    return { success: true }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to delete file')
    return { error: errorMessage }
  }
}
