'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { and, eq } from 'drizzle-orm'

import { contexts } from '@/schema'

export const deleteUrlAction = async (id: string) => {
  try {
    const userId = await getUserId()

    await db
      .delete(contexts)
      .where(and(eq(contexts.id, id), eq(contexts.userId, userId), eq(contexts.type, 'url')))

    return { success: true }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to delete URL')
    return { error: errorMessage }
  }
}
