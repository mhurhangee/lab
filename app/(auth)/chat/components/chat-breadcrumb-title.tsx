'use client'

import { ReactNode } from 'react'

import { useChatTitle } from '@/providers/chat-title'

export function ChatBreadcrumbTitle({ fallback }: { fallback: string }): ReactNode {
  const { title } = useChatTitle()
  return title || fallback
}
