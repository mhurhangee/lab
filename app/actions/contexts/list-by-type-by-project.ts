'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { contexts } from '@/schema'

import type { ContextsTypes } from '@/types/contexts'

import { and, desc, eq } from 'drizzle-orm'

interface ListContextsByTypeByProjectActionProps {
  projectId: string
  type: ContextsTypes
}

export const listContextsByTypeByProjectAction = async ({
  projectId,
  type,
}: ListContextsByTypeByProjectActionProps) => {
  try {
    const userId = await getUserId()

    const results = await db
      .select()
      .from(contexts)
      .where(
        and(eq(contexts.userId, userId), eq(contexts.projectId, projectId), eq(contexts.type, type))
      )
      .orderBy(desc(contexts.updatedAt))

    return { results }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to list ' + type + ' by project')
    return { error: errorMessage }
  }
}
