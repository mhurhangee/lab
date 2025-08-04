import { redirect } from 'next/navigation'

import { createContextAction } from '@/app/actions/contexts/create'

import { handleErrorServer } from '@/lib/error/server'

export const dynamic = 'force-dynamic'

export default async function NewFractalPage() {
  const result = await createContextAction({ type: 'fractals' })

  if ('error' in result) {
    handleErrorServer('Failed to create fractal', result.error)
    throw new Error(result.error)
  }

  redirect(`/fractal/${result.id}`)
}
