import { models } from '@/lib/models'
import { web_search_preview } from '@/lib/tools'
import { system } from '@/lib/prompts'
import { NextRequest } from 'next/server'

import { UIMessage, convertToModelMessages, streamText, smoothStream } from 'ai'

import { updateChatAction } from '@/app/actions/chats/update'

interface Body {
  messages: UIMessage[]
  chatId: string
  toolWeb: boolean
  model: string
}

export async function POST(req: NextRequest) {
  const { messages, chatId, toolWeb, model }: Body = (await req.json()) as Body

  const result = streamText({
    model: models.find((m) => m.label === model)?.model || models[0].model,
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

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: ({ messages }) => {
      void updateChatAction({ id: chatId, messages })
    },
  })
}
