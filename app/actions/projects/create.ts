'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'
import { generateId } from '@/lib/id'
import { createVectorStore } from '@/lib/openai'

import { projects } from '@/schema'

interface CreateProjectActionProps {
  title: string
  description?: string
}

export const createProjectAction = async ({ title, description }: CreateProjectActionProps) => {
  try {
    const userId = await getUserId()
    const projectId = generateId()

    // Create OpenAI vector store for this project
    const vectorStoreResult = await createVectorStore(projectId)

    if (!vectorStoreResult.success || !vectorStoreResult.vectorStoreId) {
      throw new Error(vectorStoreResult.error || 'Failed to create vector store')
    }

    const project = await db
      .insert(projects)
      .values({
        id: projectId,
        title,
        description,
        userId,
        vectorStoreId: vectorStoreResult.vectorStoreId,
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
