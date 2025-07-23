import { NextRequest } from 'next/server'

import { models } from '@/lib/models'
import { system } from '@/lib/prompts'
import { generateSuggestions } from '@/lib/suggestions'
import { web_search_preview } from '@/lib/tools'

import {
  UIMessage,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  smoothStream,
  streamText,
} from 'ai'

import { updateChatAction } from '@/app/actions/chats/update'

interface Body {
  messages: UIMessage[]
  chatId: string
  toolWeb: boolean
  model: string
}

export async function POST(req: NextRequest) {
  const { messages, chatId, toolWeb, model }: Body = (await req.json()) as Body

  const stream = createUIMessageStream({
    execute({ writer }) {
      const result = streamText({
        model: models.find(m => m.label === model)?.model || models[0].model,
        system: system,
        messages: convertToModelMessages(messages),
        experimental_transform: smoothStream({
          delayInMs: 20,
          chunking: 'line',
        }),
        tools: {
          web_search_preview,
        },
        toolChoice: toolWeb ? { type: 'tool', toolName: 'web_search_preview' } : 'auto',
      })

      writer.merge(
        result.toUIMessageStream({
          originalMessages: messages,
          onFinish: async ({ messages }) => {
            void updateChatAction({ id: chatId, messages })

            // Generate and stream suggestions
            try {
              const suggestions = await generateSuggestions(messages)

              writer.write({
                type: 'data-suggestions',
                id: 'suggestions',
                data: {
                  suggestions: suggestions,
                  status: 'ready',
                },
                transient: true,
              })
            } catch (error) {
              console.error('Failed to generate suggestions:', error)
            }
          },
        })
      )
    },
  })

  return createUIMessageStreamResponse({ stream })
}
