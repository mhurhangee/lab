import { openai } from '@ai-sdk/openai'

import { NextRequest } from 'next/server'

import { UIMessage, convertToModelMessages, streamText } from 'ai'

import { updateChatAction } from '@/app/actions/chats/update'

export async function POST(req: NextRequest) {
  const { messages, chatId }: { messages: UIMessage[]; chatId: string } = (await req.json()) as {
    messages: UIMessage[]
    chatId: string
  }

  const result = streamText({
    model: openai('gpt-4.1-mini'),
    messages: convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: ({ messages }) => {
      void updateChatAction({ id: chatId, messages })
    },
  })
}
