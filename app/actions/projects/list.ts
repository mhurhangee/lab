'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { desc, eq } from 'drizzle-orm'

import { projects } from '@/schema'

type Project = {
  id: string
  userId: string
  title: string
  description: string | null
  createdAt: Date
  updatedAt: Date
}

type ListProjectsResult =
  | { projects: Project[]; error?: never }
  | { error: string; projects?: never }

export const listProjectsAction = async (): Promise<ListProjectsResult> => {
  try {
    const userId = await getUserId()

    const results = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.updatedAt))

    return { projects: results }
  } catch (error) {
    return handleErrorServer(error, 'Failed to list projects') as { error: string }
  }
}
