import { notFound } from 'next/navigation'

import { getContextsAction } from '@/app/actions/contexts/get'

import { ErrorAlert } from '@/components/ui/error-alert'

import { LabLayout } from '@/components/lab-layout'

import { EditorApp } from '../components/editor/app'

interface TextEditorPageProps {
  params: Promise<{ id: string }>
}

export default async function TextEditorPage({ params }: TextEditorPageProps) {
  const { id } = await params
  const { context, error } = await getContextsAction({ id })

  if (error) {
    return (
      <LabLayout pageTitle="Error PDF" title="PDF" icon="file">
        <ErrorAlert error={error} />
      </LabLayout>
    )
  }

  if (!context) {
    notFound()
  }

  return <EditorApp context={context} />
}
