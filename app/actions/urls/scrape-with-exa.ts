'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'
import { generateId } from '@/lib/id'

import { Exa } from 'exa-js'

import { files } from '@/schema'

export const scrapeUrlWithExaAction = async (url: string, projectId?: string) => {
  try {
    const userId = await getUserId()

    if (!process.env.EXA_API_KEY) {
      throw new Error('EXA_API_KEY is not configured')
    }

    const exa = new Exa(process.env.EXA_API_KEY)

    const result = await exa.getContents([url], {
      context: true,
    })

    if (result.statuses?.[0].status !== 'success') {
      throw new Error('Failed to scrape URL with Exa')
    }

    const content = result.context
    const title = result.results?.[0].title || 'Untitled'
    const scrapedUrl = result.results?.[0].url || url

    // Save to files table as URL type
    const fileId = generateId()
    await db.insert(files).values({
      id: fileId,
      userId,
      name: title,
      url: scrapedUrl,
      size: content?.length || 0,
      type: 'url',
      projectId: projectId || null,
      parsedMarkdown: content,
    })

    return {
      success: true,
      file: {
        id: fileId,
        name: title,
        url: scrapedUrl,
        content,
      },
    }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to scrape URL')
    return { error: errorMessage }
  }
}
