import { notFound } from 'next/navigation'

import { ErrorAlert } from '@/components/ui/error-alert'

import { LabLayout } from '@/components/lab-layout'

import { listProjectsAction } from '@/app/actions/projects/list'
import { getUrlByIdAction } from '@/app/actions/urls/get-by-id'

import { UrlEditForm } from './components/url-edit-form'

interface UrlPageProps {
  params: Promise<{ id: string }>
}

export default async function UrlPage({ params }: UrlPageProps) {
  const { id } = await params
  const [{ url, error }, { projects }] = await Promise.all([
    getUrlByIdAction(id),
    listProjectsAction(),
  ])

  if (error || !url) {
    if (error?.includes('not found')) {
      notFound()
    }
    return (
      <LabLayout
        title="Error"
        icon="link"
        backToHref="/urls"
        backToLabel="URLs"
        breadcrumb={[
          { href: '/urls', label: 'URLs' },
          { href: `/urls/${id}`, label: 'Error' },
        ]}
      >
        <ErrorAlert error={error || 'URL not found'} />
      </LabLayout>
    )
  }

  return (
    <LabLayout
      title={url.name}
      icon="link"
      backToHref="/urls"
      backToLabel="URLs"
      breadcrumb={[
        { href: '/urls', label: 'URLs' },
        { href: `/urls/${id}`, label: url.name },
      ]}
      description="View and edit scraped URL content."
    >
      <UrlEditForm url={url} projects={projects || []} />
    </LabLayout>
  )
}
