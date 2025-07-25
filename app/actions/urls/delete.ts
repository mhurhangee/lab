'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { and, eq } from 'drizzle-orm'

import { files } from '@/schema'

export const deleteUrlAction = async (id: string) => {
  try {
    const userId = await getUserId()

    await db
      .delete(files)
      .where(and(eq(files.id, id), eq(files.userId, userId), eq(files.type, 'url')))

    return { success: true }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to delete URL')
    return { error: errorMessage }
  }
}
