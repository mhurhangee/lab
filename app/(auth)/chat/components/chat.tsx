'use client'

import { useChat } from '@ai-sdk/react'

import React, { useState } from 'react'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { ButtonTT } from '@/components/ui/button-tt'
import { Loader } from '@/components/ui/loader'
import { Markdown } from '@/components/ui/markdown'
import { Textarea } from '@/components/ui/textarea'
import { Thinking } from '@/components/ui/thinking'

import { cn } from '@/lib/utils'

import { ChatDB } from '@/types/database'

import { DefaultChatTransport, UIMessage } from 'ai'
import { ArrowUp, Bot, GlobeIcon, PlusIcon, User } from 'lucide-react'
import { useStickToBottom } from 'use-stick-to-bottom'

export const Chat = ({ savedChat }: { savedChat: ChatDB }) => {
  const { scrollRef, contentRef } = useStickToBottom()
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: {
        chatId: savedChat.id,
      },
    }),
    messages: savedChat.messages as UIMessage[],
  })
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim()) {
      void sendMessage({ text: input })
      setInput('')
    }
  }

  const disabled = status !== 'ready' || input.trim() === ''

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col gap-4">
      <div ref={scrollRef} className="shadcn-scrollbar h-[calc(100vh-12rem)] overflow-y-auto">
        <div ref={contentRef} className="p-3">
          {messages.length === 0 ? (
            <div className="text-muted-foreground flex h-32 flex-col items-center justify-center">
              <p>Start a conversation</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <React.Fragment key={message.id}>
                <div
                  className={cn(
                    'mb-4 flex w-full last:mb-0',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'user' ? (
                    // User message: content on left, avatar on right
                    <>
                      <div className="max-w-[80%] text-right">
                        {message.parts.map((part, partIndex) =>
                          part.type === 'text' ? (
                            <Markdown key={partIndex}>{part.text}</Markdown>
                          ) : null
                        )}
                      </div>
                      <div className="ml-3 flex-shrink-0">
                        <User className="mt-1 h-4 w-4" />
                      </div>
                    </>
                  ) : (
                    // Assistant message: avatar on left, content on right
                    <>
                      <div className="mr-3 flex-shrink-0">
                        <Bot className="mt-1 h-4 w-4" />
                      </div>
                      <div className="max-w-[80%] text-left">
                        {message.parts.map((part, partIndex) =>
                          part.type === 'text' ? (
                            <Markdown key={partIndex}>{part.text}</Markdown>
                          ) : null
                        )}
                        {status === 'streaming' &&
                          message.role === 'assistant' &&
                          index === messages.length - 1 && <Thinking />}
                      </div>
                    </>
                  )}
                </div>
                {status === 'submitted' &&
                  message.role === 'user' &&
                  index === messages.length - 1 && (
                    <div className={cn('mb-4 flex w-full justify-start last:mb-0')}>
                      <div className="mr-3 flex-shrink-0">
                        <Bot className="mt-1 h-4 w-4" />
                      </div>
                      <div className="max-w-[80%] text-left">
                        <Loader />
                      </div>
                    </div>
                  )}
              </React.Fragment>
            ))
          )}
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="border-input bg-input relative mt-auto flex w-full flex-col overflow-hidden rounded-lg border"
      >
        <Textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Say something..."
          className={cn(
            'max-h-[200px] min-h-[60px] resize-none overflow-y-auto border-none bg-none px-3 py-3 shadow-none',
            'shadcn-scrollbar',
            'border-0 focus-visible:border-0 focus-visible:ring-0',
            status === 'error' && 'cursor-not-allowed opacity-50'
          )}
          rows={1}
        />
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center justify-start gap-2 p-2">
            <ButtonTT size="icon" variant="outline" tooltip="New chat">
              <Link href="/chat/new">
                <PlusIcon />
              </Link>
            </ButtonTT>

            <ButtonTT size="icon" variant="ghost" tooltip="Web search">
              <GlobeIcon />
            </ButtonTT>
          </div>
          <div className="flex flex-1 items-center justify-end gap-2 p-2">
            <span className="text-muted-foreground text-xs">
              {input.length > 0 ? `${input.length} characters` : ''}
            </span>
          </div>
          <div className="flex items-center justify-end p-2">
            <Button type="submit" size="icon" disabled={disabled}>
              <ArrowUp />
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
