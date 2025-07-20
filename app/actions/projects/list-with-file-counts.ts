'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { count, desc, eq } from 'drizzle-orm'

import { files, projects } from '@/schema'

export const listProjectsWithFileCountsAction = async () => {
  try {
    const userId = await getUserId()

    const results = await db
      .select({
        id: projects.id,
        userId: projects.userId,
        title: projects.title,
        description: projects.description,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
        fileCount: count(files.id),
      })
      .from(projects)
      .leftJoin(files, eq(projects.id, files.projectId))
      .where(eq(projects.userId, userId))
      .groupBy(projects.id, projects.userId, projects.title, projects.description, projects.createdAt, projects.updatedAt)
      .orderBy(desc(projects.updatedAt))

    return { projects: results }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to list projects with file counts')
    return { error: errorMessage }
  }
}
