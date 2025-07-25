'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { and, desc, eq } from 'drizzle-orm'

import { contexts } from '@/schema'

interface ListFilesByProjectActionProps {
  projectId: string
}

export const listFilesByProjectAction = async ({ projectId }: ListFilesByProjectActionProps) => {
  try {
    const userId = await getUserId()

    const results = await db
      .select()
      .from(contexts)
      .where(and(eq(contexts.userId, userId), eq(contexts.projectId, projectId)))
      .orderBy(desc(contexts.updatedAt))

    return { files: results }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to list project files')
    return { error: errorMessage }
  }
}
