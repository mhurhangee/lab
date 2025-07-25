'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { and, eq } from 'drizzle-orm'

import { files, projects } from '@/schema'

export const getUrlByIdAction = async (id: string) => {
  try {
    const userId = await getUserId()

    const result = await db
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
      .where(and(eq(files.id, id), eq(files.userId, userId), eq(files.type, 'url')))
      .limit(1)

    if (result.length === 0) {
      throw new Error('URL not found')
    }

    return { url: result[0] }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to get URL')
    return { error: errorMessage }
  }
}
