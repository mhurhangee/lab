'use client'

import { useChat } from '@ai-sdk/react'

import React, { useState } from 'react'

import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ButtonTT } from '@/components/ui/button-tt'
import { Loader } from '@/components/ui/loader'
import { Markdown } from '@/components/ui/markdown'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Thinking } from '@/components/ui/thinking'
import { Toggle } from '@/components/ui/toggle'

import { models } from '@/lib/models'
import { cn } from '@/lib/utils'

import { TransientUIMessage } from '@/types/ai'
import { ChatDB } from '@/types/database'

import { DefaultChatTransport } from 'ai'
import { Bot, GlobeIcon, PlusIcon, Send, Square, User } from 'lucide-react'
import { useStickToBottom } from 'use-stick-to-bottom'

export const Chat = ({ savedChat }: { savedChat: ChatDB }) => {
  const [toolWeb, setToolWeb] = useState(false)
  const [suggestions, setSuggestions] = useState<{ text: string; short: string }[]>([])
  const [model, setModel] = useState(models[0].label)

  const { scrollRef, contentRef } = useStickToBottom()
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: {
        chatId: savedChat.id,
      },
    }),
    messages: savedChat.messages as TransientUIMessage[],
    onData: dataPart => {
      if (dataPart.type === 'data-suggestions') {
        setSuggestions(dataPart.data.suggestions)
      }
    },
  })
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim()) {
      void sendMessage({ text: input }, { body: { toolWeb, model } })
      setInput('')
      setSuggestions([])
    }
  }

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col gap-4">
      <div ref={scrollRef} className="shadcn-scrollbar h-[calc(100vh-8rem)] overflow-y-auto">
        <div ref={contentRef} className="p-3">
          {messages.length === 0 ? (
            <div className="text-muted-foreground flex h-32 flex-col items-center justify-center">
              <p>Start a conversation</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <React.Fragment key={index}>
                <div className={cn('mb-4 flex w-full justify-start last:mb-0')}>
                  <div className="mr-3 flex-shrink-0">
                    {message.role === 'user' ? (
                      <User className="text-muted-foreground mt-1 h-4 w-4" />
                    ) : (
                      <Bot className="text-primary mt-1 h-4 w-4" />
                    )}
                  </div>
                  <div className="max-w-[80%] text-left">
                    {message.parts.map((part, partIndex) =>
                      part.type === 'text' ? (
                        <Markdown
                          key={partIndex}
                          className={cn(
                            'text-left',
                            message.role === 'user' ? 'text-muted-foreground' : 'text-primary'
                          )}
                        >
                          {part.text}
                        </Markdown>
                      ) : null
                    )}
                    {status === 'streaming' &&
                      message.role === 'assistant' &&
                      index === messages.length - 1 && <Thinking />}
                  </div>
                </div>
                {status === 'submitted' &&
                  message.role === 'user' &&
                  index === messages.length - 1 && (
                    <div className={cn('mb-4 flex w-full justify-start last:mb-0')}>
                      <div className="mr-3 flex-shrink-0">
                        <Bot className="text-primary mt-1 h-4 w-4" />
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
      <form onSubmit={handleSubmit}>
        {suggestions.length > 0 && (
          <div className="flex items-center justify-start gap-2 pb-2">
            {suggestions.map((suggestion, index) => (
              <Badge
                variant="outline"
                key={index}
                onClick={e => {
                  e.preventDefault()
                  setInput(suggestion.text)
                }}
                className="hover:bg-secondary hover:text-secondary-foreground cursor-pointer p-1 px-3 rounded-full"
              >
                {suggestion.short}
              </Badge>
            ))}
          </div>
        )}
        <div className="border-input bg-input relative mt-auto flex w-full flex-col overflow-hidden rounded-lg border">
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
          <div className="flex items-center justify-between p-0">
            <div className="flex items-center justify-start gap-2 p-1">
              <ButtonTT size="icon" variant="ghost" tooltip="New chat">
                <Link href="/chat/new">
                  <PlusIcon />
                </Link>
              </ButtonTT>

              <Select value={model} onValueChange={setModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model, index) => (
                    <SelectItem key={index} value={model.label}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Toggle pressed={toolWeb} onPressedChange={setToolWeb} className="z-10 rounded-full">
                <GlobeIcon className="h-4 w-4" />
              </Toggle>
            </div>
            <div className="flex flex-1 items-center justify-end gap-2 p-2">
              <span className="text-muted-foreground text-xs">
                {input.length > 0 ? `${input.length} characters` : ''}
              </span>
            </div>
            <div className="flex items-center justify-end p-2">
              {status === 'streaming' || status === 'submitted' ? (
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={status !== 'streaming'}
                  onClick={() => void stop()}
                  className="text-destructive h-8 w-8 rounded-full"
                >
                  <Square className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="icon"
                  disabled={status !== 'ready' || !input.trim()}
                  className="h-8 w-8 rounded-full"
                >
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
