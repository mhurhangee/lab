import { redirect } from 'next/navigation'

import { createContextAction } from '@/app/actions/contexts/create'

import { handleErrorServer } from '@/lib/error/server'

// Force dynamic rendering since we use server actions and redirect
export const dynamic = 'force-dynamic'

export default async function NewChatPage() {
  const result = await createContextAction({ type: 'docs' })

  if ('error' in result) {
    handleErrorServer('Failed to create text editor', result.error)
    throw new Error(result.error)
  }

  redirect(`/docs/${result.id}`)
}
