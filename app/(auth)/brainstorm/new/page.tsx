import { redirect } from 'next/navigation'

import { createContextAction } from '@/app/actions/contexts/create'

import { handleErrorServer } from '@/lib/error/server'

export const dynamic = 'force-dynamic'

export default async function NewBrainstormPage() {
  const result = await createContextAction({ type: 'brainstorms' })

  if ('error' in result) {
    handleErrorServer('Failed to create brainstorm', result.error)
    throw new Error(result.error)
  }

  redirect(`/brainstorm/${result.id}`)
}
