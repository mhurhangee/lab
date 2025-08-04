import { notFound } from 'next/navigation'

import { getContextsAction } from '@/app/actions/contexts/get'

import { LabLayout } from '@/components/lab-layout'

import { FractalPlanner } from '../components/fractal-planner'

interface ChatPageProps {
  params: Promise<{ id: string }>
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params
  const { context, error } = await getContextsAction({ id })

  if (error || !context) {
    return notFound()
  }

  return (
    <LabLayout
      breadcrumb={[
        { href: '/fractal', label: 'Fractals' },
        { href: `/fractal/${context.id}`, label: context.name || 'Untitled Fractal' },
      ]}
      icon="pyramid"
      backTo={{ href: '/fractal', label: 'All fractals' }}
      pageTitle={context.name || 'Untitled Fractal'}
    >
      <FractalPlanner savedFractal={context} />
    </LabLayout>
  )
}
