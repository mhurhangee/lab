import { notFound } from 'next/navigation'

import { getContextsWithProjectAction } from '@/app/actions/contexts/get-with-project'

import { ErrorAlert } from '@/components/ui/error-alert'

import { LabLayout } from '@/components/lab-layout'

import { UrlEditForm } from '../../components/url-edit-form'

interface UrlEditPageProps {
  params: Promise<{ id: string }>
}

export default async function UrlEditPage({ params }: UrlEditPageProps) {
  const { id } = await params
  const { context: url, error } = await getContextsWithProjectAction({ id, type: 'urls' })

  if (error) {
    return (
      <LabLayout pageTitle="Edit URL" title="Edit URL" icon="link">
        <ErrorAlert error={error} />
      </LabLayout>
    )
  }

  if (!url) {
    notFound()
  }

  return (
    <LabLayout
      title={`Edit ${url.name}`}
      pageTitle={`Edit ${url.name}`}
      icon="link"
      backTo={{ href: `/urls/${url.id}`, label: url.name }}
      breadcrumb={[
        { href: '/urls', label: 'URLs' },
        { href: `/urls/${url.id}`, label: url.name },
        { href: `/urls/${url.id}/edit`, label: 'Edit' },
      ]}
      description="Edit the title, project assignment, and content of this scraped URL."
    >
      <UrlEditForm url={url} />
    </LabLayout>
  )
}
