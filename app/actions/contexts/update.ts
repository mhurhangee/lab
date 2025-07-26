'use server'

import { del, put } from '@vercel/blob'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { contexts } from '@/schema'

import { and, eq } from 'drizzle-orm'

interface UpdateContextActionProps {
  id: string
  name?: string
  projectId?: string | null
  file?: File
  markdown?: string
}

export const updateContextAction = async ({
  id,
  name,
  projectId,
  file,
  markdown,
}: UpdateContextActionProps) => {
  try {
    const userId = await getUserId()

    // Get existing file
    const existingContextResult = await db
      .select()
      .from(contexts)
      .where(and(eq(contexts.id, id), eq(contexts.userId, userId)))
      .limit(1)

    if (!existingContextResult?.length) {
      throw new Error('Context not found')
    }

    const existingContext = existingContextResult[0]
    let updateData: Partial<typeof contexts.$inferInsert> = {
      updatedAt: new Date(),
    }

    // If updating the file content
    if (file) {
      // Delete old file from blob storage
      await del(existingContext.url)

      // Upload new file
      const blob = await put(file.name, file, {
        access: 'public',
      })

      updateData = {
        ...updateData,
        name: file.name,
        url: blob.url,
        size: file.size,
        type: file.type,
      }
    }

    // If only updating the name
    if (name && !file) {
      updateData.name = name
    }

    // If updating the project
    if (projectId !== undefined) {
      updateData.projectId = projectId
    }

    if (markdown) {
      updateData.parsedMarkdown = markdown
    }

    // Update database record
    const updatedContext = await db
      .update(contexts)
      .set(updateData)
      .where(and(eq(contexts.id, id), eq(contexts.userId, userId)))
      .returning()

    if (!updatedContext?.length) {
      throw new Error('Failed to update context')
    }

    return { context: updatedContext[0], success: true }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to update context')
    return { error: errorMessage, success: false }
  }
}
