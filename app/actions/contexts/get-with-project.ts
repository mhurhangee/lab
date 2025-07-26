'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { contexts, projects } from '@/schema'

import { ContextsTypes } from '@/types/contexts'

import { and, eq } from 'drizzle-orm'

interface GetContextsWithProjectActionProps {
  id: string
  type: ContextsTypes
}

export const getContextsWithProjectAction = async ({
  id,
  type,
}: GetContextsWithProjectActionProps) => {
  try {
    const userId = await getUserId()

    const result = await db
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
      .where(and(eq(contexts.id, id), eq(contexts.userId, userId), eq(contexts.type, type)))
      .limit(1)

    if (result.length === 0) {
      throw new Error('Context not found')
    }

    return { context: result[0] }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to get context')
    return { error: errorMessage }
  }
}
