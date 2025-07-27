'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { contexts, projects } from '@/schema'

import { count, desc, eq } from 'drizzle-orm'

export const listProjectsWithFileCountsAction = async () => {
  try {
    const userId = await getUserId()

    const results = await db
      .select({
        id: projects.id,
        userId: projects.userId,
        title: projects.title,
        description: projects.description,
        vectorStoreId: projects.vectorStoreId,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
        fileCount: count(contexts.id),
      })
      .from(projects)
      .leftJoin(contexts, eq(projects.id, contexts.projectId))
      .where(eq(projects.userId, userId))
      .groupBy(
        projects.id,
        projects.userId,
        projects.title,
        projects.description,
        projects.vectorStoreId,
        projects.createdAt,
        projects.updatedAt
      )
      .orderBy(desc(projects.updatedAt))

    return { projects: results }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to list projects with file counts')
    return { error: errorMessage }
  }
}
