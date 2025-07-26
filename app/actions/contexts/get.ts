'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { contexts } from '@/schema'

import { and, eq } from 'drizzle-orm'

interface GetContextsActionProps {
  id: string
}

export const getContextsAction = async ({ id }: GetContextsActionProps) => {
  try {
    const userId = await getUserId()

    const result = await db
      .select()
      .from(contexts)
      .where(and(eq(contexts.id, id), eq(contexts.userId, userId)))
      .limit(1)

    if (!result?.length) {
      throw new Error('Contexts not found')
    }

    return { context: result[0], success: true }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to get contexts')
    return { error: errorMessage, success: false }
  }
}
