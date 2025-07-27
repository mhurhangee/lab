import { LabLayout } from '@/components/lab-layout'

import { UrlScrapeForm } from '../components/url-scrape-form'

export default function NewUrlPage() {
  return (
    <LabLayout
      title="Scrape URL"
      pageTitle="Scrape URL"
      icon="link"
      backTo={{ href: '/urls', label: 'URLs' }}
      breadcrumb={[
        { href: '/urls', label: 'URLs' },
        { href: '/urls/new', label: 'Scrape URL' },
      ]}
      description="Extract content from any URL using various extraction methods."
    >
      <UrlScrapeForm />
    </LabLayout>
  )
}
