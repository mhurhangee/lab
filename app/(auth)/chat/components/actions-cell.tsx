'use client'

import { Row } from '@tanstack/react-table'

import Link from 'next/link'

import { Eye } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { ChatDB } from '@/types/database'

import { DeleteChatDialog } from '@/app/(auth)/chat/components/delete-chat-dialog'

export function ActionsCell({ row }: { row: Row<ChatDB> }) {
  const chat = row.original

  return (
    <div className="flex items-center justify-end">
      <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
        <Link href={`/chat/${chat.id}`} className="flex items-center">
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
      <DeleteChatDialog chatId={chat.id} size="icon" />
    </div>
  )
}
