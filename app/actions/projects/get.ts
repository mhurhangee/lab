'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { and, eq } from 'drizzle-orm'

import { projects } from '@/schema'

interface GetProjectActionProps {
  id: string
}

type Project = {
  id: string
  userId: string
  title: string
  description: string | null
  createdAt: Date
  updatedAt: Date
}

type GetProjectResult = { project: Project; error?: never } | { error: string; project?: never }

export const getProjectAction = async ({
  id,
}: GetProjectActionProps): Promise<GetProjectResult> => {
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
    return handleErrorServer(error, 'Failed to get project') as { error: string }
  }
}
