import { openai } from '@ai-sdk/openai'

export const models = [
  { label: '4.1 mini', model: openai('gpt-4.1-mini') },
  { label: '4.1', model: openai('gpt-4.1') },
  { label: 'o3', model: openai('o3') },
  { label: 'o4 mini', model: openai('o4-mini') },
]
