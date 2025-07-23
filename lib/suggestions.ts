import { UIMessage, generateObject } from 'ai'
import { z } from 'zod'

import { models } from './models'

export async function generateSuggestions(
  messages: UIMessage[]
): Promise<{ text: string; short: string }[]> {
  let prompt =
    'You will be given up to the last 4 messages of a conversation. Generate 3 suggestions (as a JSON object) **from the perspective of the user to send to an AI assistant** to continue the conversation.'
  messages.map(message => {
    const textContent = message.parts
      .filter(item => item.type === 'text')
      .map(item => item.text)
      .join(' ')
    prompt += `${message.role}: ${textContent}\n`
  })

  const result = await generateObject({
    model: models[0].model,
    prompt,
    schema: z.object({
      suggestions: z
        .array(
          z.object({
            text: z.string().describe('The full suggestion text'),
            short: z.string().describe('A short version of the suggestion (2-4 words)'),
          })
        )
        .min(3)
        .max(3),
    }),
  })

  return result.object.suggestions
}
