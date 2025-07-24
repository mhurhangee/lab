'use client'

import { useChat } from '@ai-sdk/react'

import React, { useEffect, useState } from 'react'

import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ButtonTT } from '@/components/ui/button-tt'
import { ErrorAlert } from '@/components/ui/error-alert'
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

import { copyToClipboard } from '@/lib/copy-to-clipboard'
import { handleErrorClient } from '@/lib/error/client'
import { models } from '@/lib/models'
import { cn } from '@/lib/utils'

import { TransientUIMessage } from '@/types/ai'
import { ChatDB } from '@/types/database'

import { DefaultChatTransport } from 'ai'
import {
  Bot,
  Copy,
  Edit,
  GlobeIcon,
  PlusIcon,
  RefreshCw,
  Send,
  Square,
  Trash,
  User,
} from 'lucide-react'
import { toast } from 'sonner'
import { useStickToBottom } from 'use-stick-to-bottom'

import { updateChatAction } from '@/app/actions/chats/update'
import { useChatTitle } from '@/providers/chat-title'

export const Chat = ({ savedChat }: { savedChat: ChatDB }) => {
  // State
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const [toolWeb, setToolWeb] = useState(false)
  const [model, setModel] = useState(models[0].label) // Uses the first model by default (4.1-mini)

  const [suggestions, setSuggestions] = useState<{ text: string; short: string }[]>([])

  // Hooks
  const { setTitle } = useChatTitle()

  // Set initial title when component mounts
  useEffect(() => {
    if (savedChat.title) {
      setTitle(savedChat.title)
    }
  }, [savedChat.title, setTitle])

  const { scrollRef, contentRef } = useStickToBottom()

  const { messages, regenerate, sendMessage, setMessages, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: {
        chatId: savedChat.id,
      },
    }),
    messages: savedChat.messages as TransientUIMessage[],
    onData: dataPart => {
      if (dataPart.type === 'data-post') {
        console.log(dataPart.data)
        setSuggestions(dataPart.data.suggestions)
        setTitle(dataPart.data.title)
      }
    },
    onError: error => {
      setError(handleErrorClient('Error in chat', error))
    },
  })

  // Functions
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim()) {
      void sendMessage({ text: input }, { body: { toolWeb, model } })
      setInput('')
      setSuggestions([])
    }
  }

  const deleteMessage = async (messageId: string) => {
    const newMessages = messages.slice(
      0,
      messages.findIndex(message => message.id === messageId)
    )
    const { error } = await updateChatAction({ id: savedChat.id, messages: newMessages })
    if (error) {
      setError(handleErrorClient('Error deleting message', error))
    } else {
      toast.success('Message deleted')
      setMessages(newMessages)
    }
  }

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col gap-4">
      <div ref={scrollRef} className="shadcn-scrollbar h-[calc(100vh-8rem)] overflow-y-auto">
        <div ref={contentRef} className="p-3">
          {error ? (
            <ErrorAlert error={error} />
          ) : messages.length === 0 ? (
            <div className="text-muted-foreground flex h-32 flex-col items-center justify-center">
              <p>Start a conversation</p>
            </div>
          ) : (
            messages.map((message, index) => {
              // Extract the complete message text
              const messageText = message.parts
                .filter(part => part.type === 'text')
                .map(part => part.text)
                .join('')

              return (
                <React.Fragment key={index}>
                  <div className={cn('mb-4 flex w-full justify-start last:mb-0')}>
                    <div className="mr-3 flex-shrink-0">
                      {/* Avatar */}
                      {message.role === 'user' ? (
                        <User className="text-muted-foreground mt-1 h-4 w-4" />
                      ) : (
                        <Bot className="text-primary mt-1 h-4 w-4" />
                      )}
                    </div>
                    <div className="max-w-[80%] text-left">
                      {/* Message */}
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
                      {/* Assistant action buttons (regenerate, copy) */}
                      {message.role === 'assistant' &&
                        (message.id !== messages[messages.length - 1].id || status === 'ready') && (
                          <div className="flex items-center justify-start gap-2 py-2">
                            <ButtonTT
                              size="tiny"
                              variant="ghost"
                              tooltip="Regenerate"
                              onClick={() => regenerate({ messageId: message.id })}
                            >
                              <RefreshCw className="text-muted-foreground size-3" />
                            </ButtonTT>
                            <ButtonTT
                              size="tiny"
                              variant="ghost"
                              tooltip="Copy"
                              onClick={() => {
                                copyToClipboard(messageText)
                              }}
                            >
                              <Copy className="text-muted-foreground size-3" />
                            </ButtonTT>
                          </div>
                        )}
                      {/* User action buttons (delete) */}
                      {message.role === 'user' && (
                        <div className="flex items-center justify-start py-2">
                          <ButtonTT
                            size="tiny"
                            variant="ghost"
                            tooltip="Edit"
                            onClick={() => {
                              setInput(messageText)
                              deleteMessage(message.id)
                            }}
                          >
                            <Edit className="text-muted-foreground size-3" />
                          </ButtonTT>
                          <ButtonTT
                            size="tiny"
                            variant="ghost"
                            tooltip="Delete"
                            onClick={() => deleteMessage(message.id)}
                          >
                            <Trash className="text-muted-foreground size-3" />
                          </ButtonTT>
                        </div>
                      )}

                      {/* Thinking ... indicator whilst response is being streamed */}
                      {status === 'streaming' &&
                        message.role === 'assistant' &&
                        index === messages.length - 1 && <Thinking />}
                    </div>
                  </div>

                  {/* Loading indicator whilst user message is before streaming */}
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
              )
            })
          )}
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        {/* Suggestions */}
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
                className="hover:bg-secondary hover:text-secondary-foreground cursor-pointer rounded-full p-1 px-3"
              >
                {suggestion.short}
              </Badge>
            ))}
          </div>
        )}

        {/* Input */}
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

          {/* Input tools */}
          <div className="flex items-center justify-between p-0">
            <div className="flex items-center justify-start gap-2 p-1">
              {/* New chat button */}
              <ButtonTT size="icon" variant="ghost" tooltip="New chat">
                <Link href="/chat/new">
                  <PlusIcon />
                </Link>
              </ButtonTT>

              {/* Model selector */}
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

              {/* Web tools toggle */}
              <Toggle pressed={toolWeb} onPressedChange={setToolWeb} className="z-10 rounded-full">
                <GlobeIcon className="h-4 w-4" />
              </Toggle>
            </div>

            {/* Input length */}
            <div className="flex flex-1 items-center justify-end gap-2 p-2">
              <span className="text-muted-foreground text-xs">
                {input.length > 0 ? `${input.length} characters` : ''}
              </span>
            </div>

            {/* Send button */}
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
