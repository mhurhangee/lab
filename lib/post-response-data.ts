import { UIMessage, generateObject } from 'ai'
import { z } from 'zod'

import { messagesToString } from './messages-to-string'
import { models } from './models'

const schema = z.object({
  suggestions: z
    .array(
      z.object({
        text: z.string().describe('The full suggestion text'),
        short: z.string().describe('A short version of the suggestion (2-4 words)'),
      })
    )
    .min(3)
    .max(3),
  title: z.string().describe('The title of the conversation'),
})

export async function generatePostResponseData(
  messages: UIMessage[]
): Promise<z.infer<typeof schema>> {
  const messagesString = messagesToString(messages)

  const prompt = `\
  # Context
  You will be given recent messages of a conversation between a user and an AI assistant. 

  # Task
  Generate 3 suggestions **from the perspective of the user to send to an AI assistant** to continue the conversation.
  Generate a title for the conversation.
  
  # Format
  Format the response as a JSON object with the following structure:
  {
    "suggestions": [
      {
        "text": "The full suggestion text",
        "short": "A short version of the suggestion (2-4 words)"
      },
      {
        "text": "The full suggestion text",
        "short": "A short version of the suggestion (2-4 words)"
      },
      {
        "text": "The full suggestion text",
        "short": "A short version of the suggestion (2-4 words)"
      }
    ],
    "title": "The title of the conversation"
  }
  
  # Messages
  Here are the messages of the conversation:
  ${messagesString}
  `

  const result = await generateObject({
    model: models[0].model,
    prompt,
    schema,
  })

  return result.object
}
