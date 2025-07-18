'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { and, eq } from 'drizzle-orm'

import { projects } from '@/schema'

interface UpdateProjectActionProps {
  id: string
  title?: string
  description?: string
}

type UpdateProjectResult = { id: string; error?: never } | { error: string; id?: never }

export const updateProjectAction = async ({
  id,
  title,
  description,
}: UpdateProjectActionProps): Promise<UpdateProjectResult> => {
  try {
    const userId = await getUserId()

    // Only update fields that are provided
    const updateData: Record<string, string | Date | null> = {
      updatedAt: new Date(),
    }

    if (title !== undefined) {
      updateData.title = title
    }

    if (description !== undefined) {
      updateData.description = description
    }

    // If no fields to update, return early
    if (Object.keys(updateData).length <= 1) {
      throw new Error('No fields to update')
    }

    const result = await db
      .update(projects)
      .set(updateData)
      .where(and(eq(projects.id, id), eq(projects.userId, userId)))
      .returning({ id: projects.id })

    if (!result?.length) {
      throw new Error('Project not found or you do not have permission to update it')
    }

    return { id: result[0].id }
  } catch (error) {
    return handleErrorServer(error, 'Failed to update project') as { error: string }
  }
}
