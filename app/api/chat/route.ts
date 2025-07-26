import { NextRequest } from 'next/server'

import { updateChatAction } from '@/app/actions/chats/update'

import { models } from '@/lib/models'
import { generatePostResponseData } from '@/lib/post-response-data'
import { system } from '@/lib/prompts'
import { web_search_preview } from '@/lib/tools'

import {
  UIMessage,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  smoothStream,
  streamText,
} from 'ai'

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
            let title: string | null = null
            // Generate and stream suggestions
            try {
              const postResponseData = await generatePostResponseData(messages)

              writer.write({
                type: 'data-post',
                id: 'post',
                data: {
                  ...postResponseData,
                  status: 'ready',
                },
                transient: true,
              })
              title = postResponseData.title
            } catch (error) {
              console.error('Failed to generate post response data:', error)
            }

            void updateChatAction({ id: chatId, messages, title: title || undefined })
          },
        })
      )
    },
  })

  return createUIMessageStreamResponse({ stream })
}
