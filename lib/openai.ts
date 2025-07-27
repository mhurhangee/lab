'use server'

import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Create a new vector store for a project
 */
export const createVectorStore = async (projectId: string) => {
  try {
    const vectorStore = await openai.vectorStores.create({
      name: projectId,
    })

    return { vectorStoreId: vectorStore.id, success: true }
  } catch (error) {
    console.error('Failed to create vector store:', error)
    return { error: 'Failed to create vector store', success: false }
  }
}

/**
 * Upload a file to OpenAI and add it to a vector store
 */
export const uploadFileToVectorStore = async (file: File, vectorStoreId: string) => {
  try {
    // Upload file to OpenAI
    const uploadedFile = await openai.files.create({
      file: file,
      purpose: 'assistants',
    })

    // Add file to vector store
    await openai.vectorStores.files.create(vectorStoreId, {
      file_id: uploadedFile.id,
    })

    return {
      fileId: uploadedFile.id,
      vectorStoreId,
      success: true,
    }
  } catch (error) {
    console.error('Failed to upload file to vector store:', error)
    return { error: 'Failed to upload file to vector store', success: false }
  }
}

/**
 * Upload markdown content as a file to OpenAI and add it to a vector store
 */
export const uploadMarkdownToVectorStore = async (
  markdown: string,
  filename: string,
  vectorStoreId: string
) => {
  try {
    // Create a File object from markdown content
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const file = new File([blob], filename, { type: 'text/markdown' })

    return await uploadFileToVectorStore(file, vectorStoreId)
  } catch (error) {
    console.error('Failed to upload markdown to vector store:', error)
    return { error: 'Failed to upload markdown to vector store', success: false }
  }
}

/**
 * Remove a file from a vector store
 */
export const removeFileFromVectorStore = async (vectorStoreId: string, fileId: string) => {
  try {
    await openai.vectorStores.files.delete(fileId, { vector_store_id: vectorStoreId })
    return { success: true }
  } catch (error) {
    console.error('Failed to remove file from vector store:', error)
    // Don't throw error for cleanup operations in MVP
    return { error: 'Failed to remove file from vector store', success: false }
  }
}

/**
 * Delete a file from OpenAI (cleanup)
 */
export const deleteOpenAIFile = async (fileId: string) => {
  try {
    await openai.files.delete(fileId)
    return { success: true }
  } catch (error) {
    console.error('Failed to delete OpenAI file:', error)
    // Don't throw error for cleanup operations in MVP
    return { error: 'Failed to delete OpenAI file', success: false }
  }
}

/**
 * Delete a vector store (cleanup)
 */
export const deleteVectorStore = async (vectorStoreId: string) => {
  try {
    await openai.vectorStores.delete(vectorStoreId)
    return { success: true }
  } catch (error) {
    console.error('Failed to delete vector store:', error)
    // Don't throw error for cleanup operations in MVP
    return { error: 'Failed to delete vector store', success: false }
  }
}

/**
 * Search a vector store
 */
export const searchVectorStore = async (
  vectorStoreId: string,
  query: string,
  rewrite_query: boolean = false,

  maxResults: number = 10
) => {
  try {
    const results = await openai.vectorStores.search(vectorStoreId, {
      query,
      max_num_results: maxResults,
      rewrite_query,
    })

    return {
      results: results.data,
      success: true,
    }
  } catch (error) {
    console.error('Failed to search vector store:', error)
    return { error: 'Failed to search vector store', success: false }
  }
}
