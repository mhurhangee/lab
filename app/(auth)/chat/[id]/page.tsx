import { notFound } from 'next/navigation'

import { ErrorAlert } from '@/components/ui/error-alert'

import { LabLayout } from '@/components/lab-layout'

import { getChatAction } from '@/app/actions/chats/get'


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
        { href: `/chat/${chat.id}`, label: chat.title },
      ]}
      icon="bot"
      backToHref="/chat"
      backToLabel="All chats"
    >
        Test
    </LabLayout>
  )
}
