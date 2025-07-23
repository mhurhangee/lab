'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { and, eq } from 'drizzle-orm'

import { chats } from '@/schema'

interface GetChatActionProps {
  id: string
}

export const getChatAction = async ({ id }: GetChatActionProps) => {
  try {
    const userId = await getUserId()

    const result = await db
      .select()
      .from(chats)
      .where(and(eq(chats.id, id), eq(chats.userId, userId)))
      .limit(1)

    if (!result?.length) {
      throw new Error('Chat not found')
    }

    return { chat: result[0] }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to get chat')
    return { error: errorMessage }
  }
}
