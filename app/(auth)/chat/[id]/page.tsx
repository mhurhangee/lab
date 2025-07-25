import { notFound } from 'next/navigation'

import { LabLayout } from '@/components/lab-layout'

import { getChatAction } from '@/app/actions/chats/get'

import { Chat } from '../components/chat'
import { ChatBreadcrumbTitle } from '../components/chat-breadcrumb-title'

interface ChatPageProps {
  params: Promise<{ id: string }>
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params
  const { chat, error } = await getChatAction({ id })

  if (error || !chat) {
    return notFound()
  }

  return (
    <LabLayout
      breadcrumb={[
        { href: '/chat', label: 'Chats' },
        { href: `/chat/${chat.id}`, label: <ChatBreadcrumbTitle fallback={chat.title} /> },
      ]}
      icon="bot"
      backTo={{ href: '/chat', label: 'All chats' }}
    >
      <Chat savedChat={chat} />
    </LabLayout>
  )
}
