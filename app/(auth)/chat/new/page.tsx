import { redirect } from 'next/navigation'

import { createChatAction } from '@/app/actions/chats/create'
import { handleErrorServer } from '@/lib/error/server'

// Force dynamic rendering since we use server actions and redirect
export const dynamic = 'force-dynamic'

export default async function NewChatPage() {
  const result = await createChatAction({ title: 'Untitled Chat' })

  if ('error' in result) {
    handleErrorServer('Failed to create chat', result.error)
    throw new Error(result.error)
  }

  redirect(`/chat/${result.id}`)
}
