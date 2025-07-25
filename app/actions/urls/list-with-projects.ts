'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { and, desc, eq } from 'drizzle-orm'

import { contexts, projects } from '@/schema'

export const listUrlsWithProjectsAction = async () => {
  try {
    const userId = await getUserId()

    const results = await db
      .select({
        id: contexts.id,
        userId: contexts.userId,
        name: contexts.name,
        url: contexts.url,
        size: contexts.size,
        type: contexts.type,
        projectId: contexts.projectId,
        parsedMarkdown: contexts.parsedMarkdown,
        createdAt: contexts.createdAt,
        updatedAt: contexts.updatedAt,
        projectTitle: projects.title,
      })
      .from(contexts)
      .leftJoin(projects, eq(contexts.projectId, projects.id))
      .where(and(eq(contexts.userId, userId), eq(contexts.type, 'url')))
      .orderBy(desc(contexts.updatedAt))

    return { urls: results }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to list URLs with projects')
    return { error: errorMessage }
  }
}
