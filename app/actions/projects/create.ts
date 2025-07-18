'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'
import { generateId } from '@/lib/id'

import { projects } from '@/schema'

interface CreateProjectActionProps {
  title: string
  description?: string
}

type CreateProjectResult = { id: string; error?: never } | { error: string; id?: never }

export const createProjectAction = async ({
  title,
  description,
}: CreateProjectActionProps): Promise<CreateProjectResult> => {
  try {
    const userId = await getUserId()

    const project = await db
      .insert(projects)
      .values({
        id: generateId(),
        title,
        description: description || null,
        userId,
      })
      .returning({ id: projects.id })

    if (!project?.length) {
      throw new Error('Failed to create project')
    }

    return { id: project[0].id }
  } catch (error) {
    return handleErrorServer(error, 'Failed to create project') as { error: string }
  }
}
