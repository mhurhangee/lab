'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { chats } from '@/schema'

import { and, desc, eq } from 'drizzle-orm'

export const listChatsByProjectAction = async (projectId: string) => {
  try {
    const userId = await getUserId()

    const results = await db
      .select()
      .from(chats)
      .where(and(eq(chats.userId, userId), eq(chats.projectId, projectId)))
      .orderBy(desc(chats.updatedAt))

    console.log('results in listChatsByProjectAction', results)

    return { chats: results }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to list chats by project')
    return { error: errorMessage }
  }
}
