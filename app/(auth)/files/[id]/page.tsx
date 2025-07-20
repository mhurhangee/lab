import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { EntityCard } from '@/components/ui/entity-card'
import { ErrorAlert } from '@/components/ui/error-alert'

import { LabLayout } from '@/components/lab-layout'

import { formatDate } from '@/lib/date'

import { DownloadIcon, EditIcon } from 'lucide-react'

import { getFileAction } from '@/app/actions/files/get'

import { DeleteFileDialog } from '../components/delete-file-dialog'

interface FilePageProps {
  params: Promise<{ id: string }>
}

export default async function FilePage({ params }: FilePageProps) {
  const { id } = await params
  const { file, error } = await getFileAction({ id })

  if (error) {
    return (
      <LabLayout title="File" icon="file">
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
      breadcrumb={[
        { href: '/files', label: 'Files' },
        { href: `/files/${file.id}`, label: file.name },
      ]}
      icon="file"
      backToHref="/files"
      backToLabel="All files"
    >
      <EntityCard
        title={file.name}
        description={file.type}
        icon="file"
        attributes={[
          { id: 'id', label: 'ID', value: file.id, icon: 'file-text' },
          {
            id: 'updatedAt',
            label: 'Updated at',
            value: formatDate(file.updatedAt),
            icon: 'calendar',
          },
          { id: 'size', label: 'Size', value: formatFileSize(file.size), icon: 'file-text' },
          { id: 'type', label: 'Type', value: file.type, icon: 'file-text' },
        ]}
        badges={[{ label: 'Active', variant: 'default' }]}
        tags={[{ label: 'File' }]}
        actionButtons={
          <>
            <Link href={`/files/${file.id}/edit`}>
              <Button size="icon" variant="ghost">
                <EditIcon className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={file.url} target="_blank" rel="noopener noreferrer">
              <Button size="icon" variant="ghost">
                <DownloadIcon className="h-4 w-4" />
              </Button>
            </Link>
            <DeleteFileDialog fileId={file.id} size="icon" />
          </>
        }
      />

      {isImage && (
        <div className="bg-card rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-semibold">Preview</h2>
          <div className="flex justify-center">
            {file.url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={file.url}
                alt={file.name}
                className="max-h-96 max-w-full rounded-lg shadow-lg"
              />
            )}
          </div>
        </div>
      )}
    </LabLayout>
  )
}
