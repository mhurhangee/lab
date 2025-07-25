import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { ErrorAlert } from '@/components/ui/error-alert'

import { LabLayout } from '@/components/lab-layout'

import { PlusIcon } from 'lucide-react'

import { listFilesWithProjectsAction } from '@/app/actions/files/list-with-projects'

import { FilesDataTable } from './components/data-table'

export const dynamic = 'force-dynamic'

export default async function FilesPage() {
  const { files, error } = await listFilesWithProjectsAction()

  return (
    <LabLayout
      title="Files"
      icon="file"
      backTo={{ href: '/dashboard', label: 'Dashboard' }}
      breadcrumb={[{ href: '/files', label: 'Files' }]}
      actions={
        <Link href="/files/new">
          <Button size="sm">
            <PlusIcon className="h-4 w-4" />
            Upload File
          </Button>
        </Link>
      }
      description="Upload and manage your files. All files are stored securely in the cloud."
    >
      {error ? <ErrorAlert error={error} /> : <FilesDataTable data={files || []} />}
    </LabLayout>
  )
}
