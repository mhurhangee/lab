'use server'

import { createContextAction } from '@/app/actions/contexts/create'

import { getUserId } from '@/lib/auth'
import { handleErrorServer } from '@/lib/error/server'

import { Exa } from 'exa-js'

export const scrapeUrlWithExaAction = async (url: string, projectId?: string) => {
  try {
    await getUserId()
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

    // Create a context using the standard creation flow (includes OpenAI upload)
    const contextResult = await createContextAction({
      url: scrapedUrl,
      projectId,
      type: 'urls',
      metadata: {
        title,
        markdown: content,
      },
    })

    if (contextResult.error) {
      throw new Error(contextResult.error)
    }

    return {
      success: true,
      id: contextResult.id,
      file: {
        id: contextResult.id,
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
