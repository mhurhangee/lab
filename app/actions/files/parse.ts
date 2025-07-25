'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'

import { eq } from 'drizzle-orm'

import { contexts } from '@/schema'

const LLAMA_API_BASE = 'https://api.cloud.llamaindex.ai/api/v1/parsing'

type JobStatus = 'PENDING' | 'SUCCESS' | 'ERROR' | 'PARTIAL_SUCCESS' | 'CANCELLED'

interface ParseFileActionProps {
  fileId: string
}

async function uploadFileToLlama(fileUrl: string, fileName: string, apiKey: string) {
  // Fetch the file from the URL
  const fileResponse = await fetch(fileUrl)
  if (!fileResponse.ok) {
    throw new Error('Failed to fetch file from URL')
  }

  const fileBlob = await fileResponse.blob()
  const file = new File([fileBlob], fileName, { type: fileBlob.type })

  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${LLAMA_API_BASE}/upload`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  })

  const data = (await response.json()) as { id?: string; detail?: string }

  if (!response.ok) {
    throw new Error(`Upload failed: ${data.detail || response.statusText}`)
  }

  if (!data.id) {
    throw new Error('No job ID returned from upload')
  }

  return data.id
}

async function checkJobStatus(jobId: string, apiKey: string): Promise<JobStatus> {
  const response = await fetch(`${LLAMA_API_BASE}/job/${jobId}`, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  })

  const data = (await response.json()) as { status: JobStatus; detail?: string }

  if (!response.ok) {
    throw new Error(`Status check failed: ${data.detail || response.statusText}`)
  }

  return data.status
}

async function getMarkdownResult(jobId: string, apiKey: string) {
  const response = await fetch(`${LLAMA_API_BASE}/job/${jobId}/result/markdown`, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  })

  const data = (await response.json()) as { markdown?: string; detail?: string }

  if (!response.ok) {
    throw new Error(`Failed to get results: ${data.detail || response.statusText}`)
  }

  if (!data.markdown) {
    throw new Error('No markdown content returned in results')
  }

  return data.markdown
}

async function waitForJobCompletion(jobId: string, apiKey: string) {
  let status: JobStatus
  let attempts = 0
  const maxAttempts = 120 // Maximum 120 seconds of polling
  let waitTime = 1000 // Start with 1 second wait

  do {
    status = await checkJobStatus(jobId, apiKey)

    if (status === 'ERROR') {
      throw new Error('Parsing job failed')
    }

    if (status === 'CANCELLED') {
      throw new Error('Parsing job was cancelled')
    }

    if (status === 'PENDING') {
      await new Promise(resolve => setTimeout(resolve, waitTime))
      attempts++
      // Exponential backoff with a maximum of 5 seconds
      waitTime = Math.min(waitTime * 1.5, 5000)
    }

    if (attempts >= maxAttempts) {
      throw new Error(`Parsing timeout after ${maxAttempts} seconds`)
    }
  } while (status === 'PENDING')

  if (status !== 'SUCCESS' && status !== 'PARTIAL_SUCCESS') {
    throw new Error(`Unexpected job status`)
  }

  return status
}

export const parseFileAction = async ({ fileId }: ParseFileActionProps) => {
  try {
    const userId = await getUserId()

    // Get the file from database
    const fileRecord = await db.select().from(contexts).where(eq(contexts.id, fileId)).limit(1)

    if (!fileRecord?.length) {
      throw new Error('File not found')
    }

    const file = fileRecord[0]

    // Check if user owns the file
    if (file.userId !== userId) {
      throw new Error('Unauthorized')
    }

    // Check if file is already parsed
    if (file.parsedMarkdown) {
      return { success: true, message: 'File already parsed', markdown: file.parsedMarkdown }
    }

    // Get API key from environment
    const apiKey = process.env.LLAMA_CLOUD_API_KEY
    if (!apiKey) {
      throw new Error(
        'Llama Cloud API key not configured. Please set LLAMA_CLOUD_API_KEY in your environment variables.'
      )
    }

    // Upload file to Llama Cloud
    const jobId = await uploadFileToLlama(file.url, file.name, apiKey)

    // Wait for job completion
    await waitForJobCompletion(jobId, apiKey)

    // Get the markdown result
    const markdown = await getMarkdownResult(jobId, apiKey)

    // Update the file record with parsed markdown
    await db
      .update(contexts)
      .set({
        parsedMarkdown: markdown,
        updatedAt: new Date(),
      })
      .where(eq(contexts.id, fileId))

    return { success: true, message: 'File parsed successfully', markdown }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to parse file')
    return { error: errorMessage }
  }
}

export const getParseStatusAction = async ({ fileId }: { fileId: string }) => {
  try {
    const userId = await getUserId()

    const fileRecord = await db
      .select({
        id: contexts.id,
        name: contexts.name,
        parsedMarkdown: contexts.parsedMarkdown,
        userId: contexts.userId,
      })
      .from(contexts)
      .where(eq(contexts.id, fileId))
      .limit(1)

    if (!fileRecord?.length) {
      throw new Error('File not found')
    }

    const file = fileRecord[0]

    if (file.userId !== userId) {
      throw new Error('Unauthorized')
    }

    return {
      success: true,
      isParsed: !!file.parsedMarkdown,
      markdown: file.parsedMarkdown,
      fileName: file.name,
    }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to get parse status')
    return { error: errorMessage }
  }
}
