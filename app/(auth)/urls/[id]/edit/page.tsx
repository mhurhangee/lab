import { notFound } from 'next/navigation'

import { ErrorAlert } from '@/components/ui/error-alert'

import { LabLayout } from '@/components/lab-layout'

import { listProjectsAction } from '@/app/actions/projects/list'
import { getUrlByIdAction } from '@/app/actions/urls/get-by-id'

import { UrlEditForm } from '../../components/url-edit-form'

interface UrlEditPageProps {
  params: Promise<{ id: string }>
}

export default async function UrlEditPage({ params }: UrlEditPageProps) {
  const { id } = await params
  const [{ url, error }, { projects }] = await Promise.all([
    getUrlByIdAction(id),
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
      backToHref={`/urls/${url.id}`}
      backToLabel={url.name}
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
