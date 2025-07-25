'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { and, desc, eq } from 'drizzle-orm'

import { files, projects } from '@/schema'

export const listUrlsWithProjectsAction = async () => {
  try {
    const userId = await getUserId()

    const results = await db
      .select({
        id: files.id,
        userId: files.userId,
        name: files.name,
        url: files.url,
        size: files.size,
        type: files.type,
        projectId: files.projectId,
        parsedMarkdown: files.parsedMarkdown,
        createdAt: files.createdAt,
        updatedAt: files.updatedAt,
        projectTitle: projects.title,
      })
      .from(files)
      .leftJoin(projects, eq(files.projectId, projects.id))
      .where(and(eq(files.userId, userId), eq(files.type, 'url')))
      .orderBy(desc(files.updatedAt))

    return { urls: results }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to list URLs with projects')
    return { error: errorMessage }
  }
}
