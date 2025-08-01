'use client'

import { UIMessage } from '@ai-sdk/react'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import { BotIcon, ClockIcon } from 'lucide-react'

import { listChatsAction } from '@/app/actions/chats/list'
import { listChatsByProjectAction } from '@/app/actions/chats/list-by-project'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ErrorAlert } from '@/components/ui/error-alert'

import { formatDate } from '@/lib/date'
import { handleErrorClient } from '@/lib/error/client'

import type { ChatDB } from '@/types/database'

interface ChatWidgetProps {
  limit?: number
  projectId?: string
  textEditorView?: boolean
  setSavedChat?: (chat: ChatDB) => void
}

export function ChatWidget({
  limit = 3,
  projectId,
  textEditorView = false,
  setSavedChat,
}: ChatWidgetProps) {
  const [items, setItems] = useState<ChatDB[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        let result: { chats?: ChatDB[]; error?: string } = { chats: [] }
        if (projectId) {
          result = await listChatsByProjectAction(projectId)
        } else {
          result = await listChatsAction()
        }

        if (result.error) {
          setError(result.error)
          handleErrorClient(result.error, 'Failed to load files')
        } else {
          // If limit is 0, return all results, otherwise return the limit
          const filterChats = result.chats?.filter(
            chat => (chat.messages as UIMessage[]).length > 0
          )

          console.log('filterChats in chat-widget', filterChats)
          setItems(limit > 0 ? filterChats?.slice(0, limit) || [] : filterChats || [])
        }
      } catch (err) {
        setError('Failed to load files')
        handleErrorClient('Failed to load files', err)
      } finally {
        setLoading(false)
      }
    }

    void fetchFiles()
  }, [projectId, limit])

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-3">
          {[1, 2, limit].map(i => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted mb-2 h-4 w-3/4 rounded" />
              <div className="bg-muted h-3 w-1/2 rounded" />
            </div>
          ))}
        </div>
      )
    }

    if (error) {
      return <ErrorAlert error={error} />
    }

    if (items.length === 0) {
      return (
        <div className="text-muted-foreground text-sm">
          No chats in this project yet. <Link href={`/chats/new`}>Add some chats</Link> to get
          started.
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {textEditorView &&
          items.map(item => (
            <div
              key={item.id}
              className="group hover:bg-muted/50 cursor-pointer rounded-lg p-2 transition-colors"
            >
              <div className="flex items-start justify-between">
                <Button variant="ghost" onClick={() => handleLoadChat(item)}>
                  <BotIcon className="h-4 w-4" /> {item.title}
                </Button>
              </div>
            </div>
          ))}

        {!textEditorView &&
          items.map(item => (
            <Link key={item.id} href={`/chats/${item.id}`}>
              <div className="group hover:bg-muted/50 cursor-pointer rounded-lg p-2 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <BotIcon className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h4 className="group-hover:text-primary truncate text-sm font-medium">
                        {item.title}
                      </h4>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {(item.messages as UIMessage[]).length} messages
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          <ClockIcon className="mr-1 h-3 w-3" />
                          {formatDate(item.updatedAt)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    )
  }

  const handleLoadChat = (chat: ChatDB) => {
    setSavedChat?.(chat)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-1 text-sm font-medium">
          <BotIcon className="h-4 w-4" />
          Recent chats
        </CardTitle>
        <Link href={`/chats`}>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  )
}
