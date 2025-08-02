import { notFound } from 'next/navigation'

import { getContextsAction } from '@/app/actions/contexts/get'

import { LabLayout } from '@/components/lab-layout'

import { Brainstorm } from '../components/brainstorm'

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
        { href: '/brainstorm', label: 'Brainstorms' },
        { href: `/brainstorm/${context.id}`, label: context.name || 'Untitled Brainstorm' },
      ]}
      icon="lightbulb"
      backTo={{ href: '/brainstorm', label: 'All brainstorms' }}
      pageTitle={context.name || 'Untitled Brainstorm'}
    >
      <Brainstorm savedBrainstorm={context} />
    </LabLayout>
  )
}
