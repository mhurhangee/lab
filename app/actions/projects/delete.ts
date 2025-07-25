'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { and, eq } from 'drizzle-orm'

import { contexts, projects } from '@/schema'

interface DeleteProjectActionProps {
  id: string
}

export const deleteProjectAction = async ({ id }: DeleteProjectActionProps) => {
  try {
    const userId = await getUserId()

    // First, clear the projectId from all files associated with this project
    await db
      .update(contexts)
      .set({ projectId: null })
      .where(and(eq(contexts.projectId, id), eq(contexts.userId, userId)))

    // Then delete the project
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
