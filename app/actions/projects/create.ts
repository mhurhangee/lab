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

export const createProjectAction = async ({ title, description }: CreateProjectActionProps) => {
  try {
    const userId = await getUserId()

    const project = await db
      .insert(projects)
      .values({
        id: generateId(),
        title,
        description,
        userId,
      })
      .returning({ id: projects.id })

    if (!project?.length) {
      throw new Error('Failed to create project')
    }

    return { id: project[0].id }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to create project')
    return { error: errorMessage }
  }
}
