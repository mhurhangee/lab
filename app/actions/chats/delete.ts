'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { chats } from '@/schema'

import { and, eq } from 'drizzle-orm'

interface DeleteChatActionProps {
  id: string
}

export const deleteChatAction = async ({ id }: DeleteChatActionProps) => {
  try {
    const userId = await getUserId()

    // Delete from database
    await db.delete(chats).where(and(eq(chats.id, id), eq(chats.userId, userId)))

    return { success: true }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to delete file')
    return { error: errorMessage }
  }
}
