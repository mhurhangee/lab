import { LabLayout } from '@/components/lab-layout'

import { listProjectsAction } from '@/app/actions/projects/list'

import { UrlScrapeForm } from '../components/url-scrape-form'

export default async function NewUrlPage() {
  const { projects } = await listProjectsAction()

  return (
    <LabLayout
      title="Scrape URL"
      icon="link"
      backToHref="/urls"
      backToLabel="URLs"
      breadcrumb={[
        { href: '/urls', label: 'URLs' },
        { href: '/urls/new', label: 'Scrape URL' },
      ]}
      description="Extract content from any URL using various extraction methods."
    >
      <UrlScrapeForm projects={projects || []} />
    </LabLayout>
  )
}
