'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'
import { generateId } from '@/lib/id'

import { chats } from '@/schema'

interface CreateChatActionProps {
  title: string
}

export const createChatAction = async ({ title }: CreateChatActionProps) => {
  try {
    const userId = await getUserId()

    const chat = await db
      .insert(chats)
      .values({
        id: generateId(),
        title,
        userId,
      })
      .returning({ id: chats.id })

    if (!chat?.length) {
      throw new Error('Failed to create chat')
    }

    return { id: chat[0].id }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to create project')
    return { error: errorMessage }
  }
}
