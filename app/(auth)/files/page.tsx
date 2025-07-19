import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { ErrorAlert } from '@/components/ui/error-alert'

import { LabLayout } from '@/components/lab-layout'

import { FileIcon, PlusIcon } from 'lucide-react'

import { listFilesAction } from '@/app/actions/files/list'

import { DataTable } from './components/data-table'

export const dynamic = 'force-dynamic'

export default async function FilesPage() {
  const { files, error } = await listFilesAction()

  return (
    <LabLayout
      title="Files"
      icon={<FileIcon />}
      actions={
        <div className="flex items-center gap-2">
          <Link href="/files/new">
            <Button size="sm">
              <PlusIcon className="h-4 w-4" />
              Upload File
            </Button>
          </Link>
        </div>
      }
      description="Manage your files"
    >
      <div className="max-w-2xl py-8">
        <h1 className="page-title">Files</h1>
        <p className="page-subtitle">
          Upload and manage your files. All files are stored securely in the cloud.
        </p>
      </div>
      <div className="space-y-8 py-8">
        {error ? <ErrorAlert error={error} /> : <DataTable data={files || []} />}
      </div>
    </LabLayout>
  )
}
