'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { desc, eq } from 'drizzle-orm'

import { chats } from '@/schema'

export const listChatsAction = async () => {
  try {
    const userId = await getUserId()

    const results = await db
      .select()
      .from(chats)
      .where(eq(chats.userId, userId))
      .orderBy(desc(chats.updatedAt))

    return { chats: results }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to list chats')
    return { error: errorMessage }
  }
}
