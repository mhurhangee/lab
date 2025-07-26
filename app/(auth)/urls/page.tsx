import Link from 'next/link'

import { PlusIcon } from 'lucide-react'

import { listContextsByTypeWithProjectsAction } from '@/app/actions/contexts/list-by-type-with-project'

import { Button } from '@/components/ui/button'
import { ErrorAlert } from '@/components/ui/error-alert'

import { LabLayout } from '@/components/lab-layout'

import { UrlsDataTable } from './components/data-table'

export const dynamic = 'force-dynamic'

export default async function UrlsPage() {
  const { contexts: urls, error } = await listContextsByTypeWithProjectsAction({ type: 'urls' })

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
