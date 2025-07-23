'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { UIMessage } from 'ai'
import { and, eq } from 'drizzle-orm'

import { chats } from '@/schema'

interface UpdateChatActionProps {
  id: string
  title?: string
  messages?: UIMessage[]
}

type UpdateChatResult = { id: string; error?: never } | { error: string; id?: never }

export const updateChatAction = async ({
  id,
  title,
  messages,
}: UpdateChatActionProps): Promise<UpdateChatResult> => {
  try {
    const userId = await getUserId()

    // Only update fields that are provided
    const updateData: Record<string, string | Date | null | UIMessage[]> = {
      updatedAt: new Date(),
    }

    if (title !== undefined) {
      updateData.title = title
    }

    if (messages !== undefined) {
      updateData.messages = messages
    }

    const result = await db
      .update(chats)
      .set(updateData)
      .where(and(eq(chats.id, id), eq(chats.userId, userId)))
      .returning({ id: chats.id })

    if (!result?.length) {
      throw new Error('Chat not found or you do not have permission to update it')
    }

    return { id: result[0].id }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to update chat')
    return { error: errorMessage }
  }
}
