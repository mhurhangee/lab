'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { projects } from '@/schema'

import { desc, eq } from 'drizzle-orm'

export const listProjectsAction = async () => {
  try {
    const userId = await getUserId()

    const results = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.updatedAt))

    return { projects: results }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to list projects')
    return { error: errorMessage }
  }
}
