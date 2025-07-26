import Link from 'next/link'

import { PlusIcon } from 'lucide-react'

import { listContextsByTypeWithProjectsAction } from '@/app/actions/contexts/list-by-type-with-project'

import { Button } from '@/components/ui/button'
import { ErrorAlert } from '@/components/ui/error-alert'

import { LabLayout } from '@/components/lab-layout'

import { PdfsDataTable } from './components/data-table'

export const dynamic = 'force-dynamic'

export default async function PdfsPage() {
  const { contexts, error } = await listContextsByTypeWithProjectsAction({ type: 'pdfs' })

  return (
    <LabLayout
      title="PDFs"
      icon="file"
      backTo={{ href: '/dashboard', label: 'Dashboard' }}
      breadcrumb={[{ href: '/pdfs', label: 'PDFs' }]}
      actions={
        <Link href="/pdfs/new">
          <Button size="sm">
            <PlusIcon className="h-4 w-4" />
            Upload PDF
          </Button>
        </Link>
      }
      description="Upload and manage your PDFs. All PDFs are stored securely in the cloud."
    >
      {error ? <ErrorAlert error={error} /> : <PdfsDataTable data={contexts || []} />}
    </LabLayout>
  )
}
