'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { contexts, projects } from '@/schema'

import type { ContextsTypes } from '@/types/contexts'

import { and, desc, eq } from 'drizzle-orm'

interface ListContextsByTypeWithProjectsActionProps {
  type: ContextsTypes
}

export const listContextsByTypeWithProjectsAction = async ({
  type,
}: ListContextsByTypeWithProjectsActionProps) => {
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
        fileType: contexts.fileType,
        projectId: contexts.projectId,
        parsedMarkdown: contexts.parsedMarkdown,
        openaiUploadId: contexts.openaiUploadId,
        createdAt: contexts.createdAt,
        updatedAt: contexts.updatedAt,
        projectTitle: projects.title,
      })
      .from(contexts)
      .leftJoin(projects, eq(contexts.projectId, projects.id))
      .where(and(eq(contexts.userId, userId), eq(contexts.type, type)))
      .orderBy(desc(contexts.updatedAt))

    return { contexts: results }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to list contexts with projects')
    return { error: errorMessage }
  }
}
