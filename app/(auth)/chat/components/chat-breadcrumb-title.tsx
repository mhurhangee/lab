'use client'

import { useChatTitle } from '@/providers/chat-title'

export const ChatBreadcrumbTitle = ({ fallback }: { fallback: string }): string => {
  const { title } = useChatTitle()
  return title || fallback
}
