import Link from 'next/link'

import { PlusIcon } from 'lucide-react'

import { listChatsAction } from '@/app/actions/chats/list'

import { Button } from '@/components/ui/button'
import { ErrorAlert } from '@/components/ui/error-alert'

import { LabLayout } from '@/components/lab-layout'

import { ChatsDataTable } from './components/data-table'

export const dynamic = 'force-dynamic'

export default async function ChatsPage() {
  const { chats, error } = await listChatsAction()

  return (
    <LabLayout
      title="Chats"
      icon="bot"
      breadcrumb={[{ href: '/chat', label: 'Chat' }]}
      backTo={{ href: '/dashboard', label: 'Dashboard' }}
      actions={
        <Link href="/chat/new">
          <Button size="sm">
            <PlusIcon className="h-4 w-4" />
            New Chat
          </Button>
        </Link>
      }
      description="Manage, view, and create new chats."
      pageTitle="Chats"
    >
      {error ? <ErrorAlert error={error} /> : <ChatsDataTable data={chats || []} />}
    </LabLayout>
  )
}
