'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { desc, eq, and } from 'drizzle-orm'

import { contexts } from '@/schema'

import { ContextsTypes } from '@/types/contexts'

export const listContextsAction = async (type: ContextsTypes) => {
  try {
    const userId = await getUserId()

    const results = await db
      .select()
      .from(contexts)
      .where(and(eq(contexts.userId, userId), eq(contexts.type, type)))
      .orderBy(desc(contexts.updatedAt))

    return { results }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to list ' + type)
    return { error: errorMessage }
  }
}
