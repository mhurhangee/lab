'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { desc, eq } from 'drizzle-orm'

import { contexts } from '@/schema'

export const listFilesAction = async () => {
  try {
    const userId = await getUserId()

    const results = await db
      .select()
      .from(contexts)
      .where(eq(contexts.userId, userId))
      .orderBy(desc(contexts.updatedAt))

    return { files: results }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to list files')
    return { error: errorMessage }
  }
}
