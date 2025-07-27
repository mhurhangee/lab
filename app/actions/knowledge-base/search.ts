'use server'

import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleErrorServer } from '@/lib/error/server'
import { searchVectorStore } from '@/lib/openai'

import { projects } from '@/schema'

import { and, eq } from 'drizzle-orm'
import OpenAI from 'openai'

interface SearchKnowledgeBaseActionProps {
  projectId: string
  query: string
  rewriteQuery?: boolean
  maxResults?: number
}

export const searchKnowledgeBaseAction = async ({
  projectId,
  query,
  rewriteQuery = false,
  maxResults = 10,
}: SearchKnowledgeBaseActionProps) => {
  try {
    const userId = await getUserId()

    // Verify user owns the project and get vector store ID
    const projectResult = await db
      .select({ vectorStoreId: projects.vectorStoreId })
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
      .limit(1)

    if (!projectResult?.length) {
      throw new Error('Project not found')
    }

    if (!projectResult[0].vectorStoreId) {
      throw new Error('Project does not have a knowledge base')
    }

    const vectorStoreId = projectResult[0].vectorStoreId

    // Perform the search
    const searchResult = await searchVectorStore(vectorStoreId, query, rewriteQuery, maxResults)

    if (!searchResult.success) {
      throw new Error(searchResult.error || 'Search failed')
    }

    // Transform OpenAI results to our expected format
    const transformedResults = (searchResult.results || []).map(
      (result: OpenAI.VectorStoreSearchResponse, index: number) => ({
        id: `result-${index}`,
        content: Array.isArray(result.content)
          ? result.content.map(c => c.text || '').join(' ')
          : result.content || '',
        score: result.score || 0,
        metadata: {
          filename: result.filename || result.filename,
        },
      })
    )

    return {
      results: transformedResults,
      success: true,
    }
  } catch (error) {
    const errorMessage = handleErrorServer(error, 'Failed to search knowledge base')
    return { error: errorMessage, success: false }
  }
}
