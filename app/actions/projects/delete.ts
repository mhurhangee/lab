'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { and, eq } from 'drizzle-orm'

import { projects } from '@/schema'

interface DeleteProjectActionProps {
  id: string
}

export const deleteProjectAction = async ({ id }: DeleteProjectActionProps) => {
  try {
    const userId = await getUserId()

    const result = await db
      .delete(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userId)))
      .returning({ id: projects.id })

    if (!result?.length) {
      throw new Error('Project not found or you do not have permission to delete it')
    }

    return { success: true }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to delete project')
    return { error: errorMessage }
  }
}
