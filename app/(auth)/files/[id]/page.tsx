import { notFound } from 'next/navigation'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { ErrorAlert } from '@/components/ui/error-alert'

import { LabLayout } from '@/components/lab-layout'

import { FileIcon, EditIcon, DownloadIcon, TrashIcon } from 'lucide-react'

import { getFileAction } from '@/app/actions/files/get'
import { DeleteButton } from '../components/delete-button'

interface FilePageProps {
  params: Promise<{ id: string }>
}

export default async function FilePage({ params }: FilePageProps) {
  const { id } = await params
  const { file, error } = await getFileAction({ id })

  if (error) {
    return (
      <LabLayout title="File" icon={<FileIcon />}>
        <ErrorAlert error={error} />
      </LabLayout>
    )
  }

  if (!file) {
    notFound()
  }

  const formatFileSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`
  }

  const isImage = file.type.startsWith('image/')

  return (
    <LabLayout
      title={file.name}
      icon={<FileIcon />}
      actions={
        <div className="flex items-center gap-2">
          <Link href={`/files/${file.id}/edit`}>
            <Button size="sm" variant="outline">
              <EditIcon className="h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Link href={file.url} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline">
              <DownloadIcon className="h-4 w-4" />
              Download
            </Button>
          </Link>
          <DeleteButton fileId={file.id} fileName={file.name} />
        </div>
      }
      description="View and manage file"
    >
      <div className="max-w-4xl py-8">
        <div className="space-y-6">
          <div>
            <h1 className="page-title">{file.name}</h1>
            <p className="page-subtitle">
              {file.type} • {formatFileSize(file.size)} • Uploaded {new Date(file.createdAt).toLocaleDateString()}
            </p>
          </div>

          {isImage && (
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">Preview</h2>
              <div className="flex justify-center">
                <img
                  src={file.url}
                  alt={file.name}
                  className="max-w-full max-h-96 rounded-lg shadow-lg"
                />
              </div>
            </div>
          )}

          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">File Details</h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                <dd className="text-sm">{file.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Type</dt>
                <dd className="text-sm">{file.type}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Size</dt>
                <dd className="text-sm">{formatFileSize(file.size)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Uploaded</dt>
                <dd className="text-sm">{new Date(file.createdAt).toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Last Modified</dt>
                <dd className="text-sm">{new Date(file.updatedAt).toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">URL</dt>
                <dd className="text-sm">
                  <Link href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    View File
                  </Link>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </LabLayout>
  )
}
