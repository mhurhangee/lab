'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { and, eq } from 'drizzle-orm'

import { projects } from '@/schema'

interface GetProjectActionProps {
  id: string
}

export const getProjectAction = async ({ id }: GetProjectActionProps) => {
  try {
    const userId = await getUserId()

    const result = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userId)))

    if (!result?.length) {
      throw new Error('Project not found or you do not have permission to access it')
    }

    return { project: result[0] }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to get project')
    return { error: errorMessage }
  }
}
