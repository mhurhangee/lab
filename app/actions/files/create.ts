'use server'

import { put } from '@vercel/blob'
import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'
import { generateId } from '@/lib/id'

import { files } from '@/schema'

interface CreateFileActionProps {
  file: File
  projectId?: string
}

export const createFileAction = async ({ file, projectId }: CreateFileActionProps) => {
  try {
    const userId = await getUserId()

    // Upload file to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
    })

    // Save file metadata to database
    const fileRecord = await db
      .insert(files)
      .values({
        id: generateId(),
        userId,
        name: file.name,
        url: blob.url,
        size: file.size,
        type: file.type,
        projectId,
      })
      .returning({ id: files.id })

    if (!fileRecord?.length) {
      throw new Error('Failed to create file record')
    }

    return { id: fileRecord[0].id, url: blob.url }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to upload file')
    return { error: errorMessage }
  }
}
