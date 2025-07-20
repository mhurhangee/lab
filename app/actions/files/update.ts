'use server'

import { del, put } from '@vercel/blob'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { and, eq } from 'drizzle-orm'

import { files } from '@/schema'

interface UpdateFileActionProps {
  id: string
  file?: File
  name?: string
  projectId?: string | null
}

export const updateFileAction = async ({ id, file, name, projectId }: UpdateFileActionProps) => {
  try {
    const userId = await getUserId()

    // Get existing file
    const existingFileResult = await db
      .select()
      .from(files)
      .where(and(eq(files.id, id), eq(files.userId, userId)))
      .limit(1)

    if (!existingFileResult?.length) {
      throw new Error('File not found')
    }

    const existingFile = existingFileResult[0]
    let updateData: Partial<typeof files.$inferInsert> = {
      updatedAt: new Date(),
    }

    // If updating the file content
    if (file) {
      // Delete old file from blob storage
      await del(existingFile.url)

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

    // Update database record
    const updatedFile = await db
      .update(files)
      .set(updateData)
      .where(and(eq(files.id, id), eq(files.userId, userId)))
      .returning()

    if (!updatedFile?.length) {
      throw new Error('Failed to update file')
    }

    return { file: updatedFile[0] }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to update file')
    return { error: errorMessage }
  }
}
