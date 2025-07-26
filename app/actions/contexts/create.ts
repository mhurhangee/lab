'use server'

import { put } from '@vercel/blob'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'
import { generateId } from '@/lib/id'

import { contexts } from '@/schema'

import { ContextsTypes } from '@/types/contexts'

interface CreateContextActionProps {
  file: File
  projectId?: string
  type: ContextsTypes
}

export const createContextAction = async ({ file, projectId, type }: CreateContextActionProps) => {
  try {
    const userId = await getUserId()

    // Upload file to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
    })

    // Save file metadata to database
    const contextRecord = await db
      .insert(contexts)
      .values({
        id: generateId(),
        userId,
        name: file.name,
        url: blob.url,
        size: file.size,
        type: type,
        fileType: file.type,
        projectId,
      })
      .returning({ id: contexts.id })

    if (!contextRecord?.length) {
      throw new Error('Failed to create context record')
    }

    return { id: contextRecord[0].id, url: blob.url, success: true }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to upload context')
    return { error: errorMessage, success: false }
  }
}
