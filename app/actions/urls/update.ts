'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { and, eq } from 'drizzle-orm'

import { contexts } from '@/schema'

export const updateUrlAction = async (
  id: string,
  data: { name?: string; parsedMarkdown?: string; projectId?: string | null }
) => {
  try {
    const userId = await getUserId()

    const updateData: Partial<typeof contexts.$inferInsert> = {
      updatedAt: new Date(),
    }

    if (data.name !== undefined) updateData.name = data.name
    if (data.parsedMarkdown !== undefined) updateData.parsedMarkdown = data.parsedMarkdown
    if (data.projectId !== undefined) updateData.projectId = data.projectId

    await db
      .update(contexts)
      .set(updateData)
      .where(and(eq(contexts.id, id), eq(contexts.userId, userId), eq(contexts.type, 'url')))

    return { success: true }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to update URL')
    return { error: errorMessage }
  }
}
