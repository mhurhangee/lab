'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { chats, projects } from '@/schema'

import { desc, eq } from 'drizzle-orm'

export const listChatsWithProjectAction = async () => {
  try {
    const userId = await getUserId()

    const results = await db
      .select({
        id: chats.id,
        userId: chats.userId,
        title: chats.title,
        messages: chats.messages,
        createdAt: chats.createdAt,
        updatedAt: chats.updatedAt,
        projectId: chats.projectId,
        projectTitle: projects.title,
      })
      .from(chats)
      .leftJoin(projects, eq(chats.projectId, projects.id))
      .where(eq(chats.userId, userId))
      .orderBy(desc(chats.updatedAt))

    return { chats: results }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to list chats')
    return { error: errorMessage }
  }
}
