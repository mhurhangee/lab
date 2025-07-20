'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { desc, eq } from 'drizzle-orm'

import { files } from '@/schema'

export const listFilesAction = async () => {
  try {
    const userId = await getUserId()

    const results = await db
      .select()
      .from(files)
      .where(eq(files.userId, userId))
      .orderBy(desc(files.updatedAt))

    return { files: results }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to list files')
    return { error: errorMessage }
  }
}
