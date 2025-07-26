import { notFound } from 'next/navigation'

import { getContextsWithProjectAction } from '@/app/actions/contexts/get-with-project'
import { listProjectsAction } from '@/app/actions/projects/list'

import { ErrorAlert } from '@/components/ui/error-alert'

import { LabLayout } from '@/components/lab-layout'

import { UrlEditForm } from '../../components/url-edit-form'

interface UrlEditPageProps {
  params: Promise<{ id: string }>
}

export default async function UrlEditPage({ params }: UrlEditPageProps) {
  const { id } = await params
  const [{ context: url, error }, { projects }] = await Promise.all([
    getContextsWithProjectAction({ id, type: 'urls' }),
    listProjectsAction(),
  ])

  if (error) {
    return (
      <LabLayout title="Edit URL" icon="link">
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
      icon="link"
      backTo={{ href: `/urls/${url.id}`, label: url.name }}
      breadcrumb={[
        { href: '/urls', label: 'URLs' },
        { href: `/urls/${url.id}`, label: url.name },
        { href: `/urls/${url.id}/edit`, label: 'Edit' },
      ]}
      description="Edit the title, project assignment, and content of this scraped URL."
    >
      <UrlEditForm url={url} projects={projects || []} />
    </LabLayout>
  )
}
