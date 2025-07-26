'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { contexts } from '@/schema'

import { desc, eq } from 'drizzle-orm'

export const listContextsAction = async () => {
  try {
    const userId = await getUserId()

    const results = await db
      .select()
      .from(contexts)
      .where(eq(contexts.userId, userId))
      .orderBy(desc(contexts.updatedAt))

    return { results, success: true }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to list contexts')
    return { error: errorMessage, success: false }
  }
}
