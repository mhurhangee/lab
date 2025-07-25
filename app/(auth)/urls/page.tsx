import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { ErrorAlert } from '@/components/ui/error-alert'

import { LabLayout } from '@/components/lab-layout'

import { PlusIcon } from 'lucide-react'

import { listUrlsWithProjectsAction } from '@/app/actions/urls/list-with-projects'

import { UrlsDataTable } from './components/data-table'

export const dynamic = 'force-dynamic'

export default async function UrlsPage() {
  const { urls, error } = await listUrlsWithProjectsAction()

  return (
    <LabLayout
      title="URLs"
      icon="link"
      backTo={{ href: '/dashboard', label: 'Dashboard' }}
      breadcrumb={[{ href: '/urls', label: 'URLs' }]}
      actions={
        <Link href="/urls/new">
          <Button size="sm">
            <PlusIcon className="h-4 w-4" />
            Scrape URL
          </Button>
        </Link>
      }
      description="Scrape and manage URLs. All scraped content is stored as markdown."
    >
      {error ? <ErrorAlert error={error} /> : <UrlsDataTable data={urls || []} />}
    </LabLayout>
  )
}
