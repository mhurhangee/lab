import { openai } from '@ai-sdk/openai'

export const web_search_preview = openai.tools.webSearchPreview({
  searchContextSize: 'high',
  userLocation: {
    type: 'approximate',
    country: 'GB',
  },
})
