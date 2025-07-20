'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { and, eq } from 'drizzle-orm'

import { files } from '@/schema'

interface GetFileActionProps {
  id: string
}

export const getFileAction = async ({ id }: GetFileActionProps) => {
  try {
    const userId = await getUserId()

    const result = await db
      .select()
      .from(files)
      .where(and(eq(files.id, id), eq(files.userId, userId)))
      .limit(1)

    if (!result?.length) {
      throw new Error('File not found')
    }

    return { file: result[0] }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to get file')
    return { error: errorMessage }
  }
}
