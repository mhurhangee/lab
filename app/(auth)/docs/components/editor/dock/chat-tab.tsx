'use client'

import { useState } from 'react'

import { createChatAction } from '@/app/actions/chats/create'
import { getChatAction } from '@/app/actions/chats/get'

import { Button } from '@/components/ui/button'

import { ChatWidget } from '@/components/chat-widget'

import { handleErrorServer } from '@/lib/error/server'

import { ChatTitleProvider } from '@/providers/chat-title'
import { useProject } from '@/providers/project'

import { ChatDB } from '@/types/database'

import { Chat } from '@/app/(auth)/chat/components/chat'

export const ChatTab = () => {
  const [savedChat, setSavedChat] = useState<ChatDB | undefined>(undefined)

  const { selectedProject } = useProject()

  const handleStartNewChat = async () => {
    const result = await createChatAction({ title: 'Untitled Chat' })

    if ('error' in result) {
      handleErrorServer('Failed to create chat', result.error)
      throw new Error(result.error)
    }

    const { chat, error } = await getChatAction({ id: result.id })

    if (error) {
      handleErrorServer('Failed to get chat', error)
      throw new Error(error)
    }

    setSavedChat(chat)
  }

  if (savedChat) {
    return (
      <ChatTitleProvider>
        <Chat savedChat={savedChat} setSavedChat={setSavedChat} textEditorView={true} />
      </ChatTitleProvider>
    )
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <ChatWidget
        limit={3}
        projectId={selectedProject?.id}
        textEditorView={true}
        setSavedChat={setSavedChat}
      />
      <Button className="mt-4" onClick={handleStartNewChat}>
        Start new chat
      </Button>
    </div>
  )
}
