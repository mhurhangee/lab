'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { desc, eq } from 'drizzle-orm'

import { files, projects } from '@/schema'

export const listFilesWithProjectsAction = async () => {
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
      .where(eq(files.userId, userId))
      .orderBy(desc(files.updatedAt))

    return { files: results }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to list files with projects')
    return { error: errorMessage }
  }
}
