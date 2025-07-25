import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { EntityCard } from '@/components/ui/entity-card'
import { ErrorAlert } from '@/components/ui/error-alert'

import { LabLayout } from '@/components/lab-layout'

import { formatDate } from '@/lib/date'
import { formatFileSize } from '@/lib/file-size'

import { CheckCircleIcon, DownloadIcon, EditIcon, FileTextIcon, Volume2Icon } from 'lucide-react'

import { getFileAction } from '@/app/actions/files/get'
import { getParseStatusAction } from '@/app/actions/files/parse'

import { DeleteFileDialog } from '../components/delete-file-dialog'

interface FilePageProps {
  params: Promise<{ id: string }>
}

export default async function FilePage({ params }: FilePageProps) {
  const { id } = await params
  const { file, error } = await getFileAction({ id })

  // Get parse status
  const parseStatus = file ? await getParseStatusAction({ fileId: file.id }) : null

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

  const isImage = file.type.startsWith('image/')

  return (
    <LabLayout
      breadcrumb={[
        { href: '/files', label: 'Files' },
        { href: `/files/${file.id}`, label: file.name },
      ]}
      icon="file"
      backTo={{ href: '/files', label: 'All files' }}
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
            <Link href={`/parse?fileId=${file.id}`}>
              <Button
                size="icon"
                variant="ghost"
                title={
                  parseStatus?.success && parseStatus.isParsed
                    ? 'View parsed content'
                    : 'Parse file'
                }
              >
                {parseStatus?.success && parseStatus.isParsed ? (
                  <CheckCircleIcon className="h-4 w-4 text-green-600" />
                ) : (
                  <FileTextIcon className="h-4 w-4" />
                )}
              </Button>
            </Link>
            {parseStatus?.success && parseStatus.isParsed && (
              <Link href={`/text-to-speech?fileId=${file.id}`}>
                <Button size="icon" variant="ghost" title="Convert to speech">
                  <Volume2Icon className="h-4 w-4" />
                </Button>
              </Link>
            )}
            <DeleteFileDialog fileId={file.id} size="icon" />
          </>
        }
      />

      {/* Parse Status Section */}
      <div className="bg-card rounded-lg border p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <FileTextIcon className="h-5 w-5" />
          Parse Status
        </h2>
        {parseStatus?.success ? (
          parseStatus.isParsed ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span className="text-sm font-medium">File has been parsed</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Parsed Content:</span>
                  <div className="flex gap-2">
                    <Link href={`/text-to-speech?fileId=${file.id}`}>
                      <Button variant="outline" size="sm">
                        <Volume2Icon className="mr-2 h-4 w-4" />
                        Listen
                      </Button>
                    </Link>
                    <Link href={`/parse?fileId=${file.id}`}>
                      <Button variant="outline" size="sm">
                        View/Edit Parse
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="bg-muted max-h-48 overflow-y-auto rounded-md p-3">
                  <pre className="text-xs whitespace-pre-wrap">
                    {parseStatus.markdown
                      ? parseStatus.markdown.substring(0, 500) +
                        (parseStatus.markdown.length > 500 ? '...' : '')
                      : 'No content available'}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-muted-foreground flex items-center gap-2">
                <FileTextIcon className="h-4 w-4" />
                <span className="text-sm">File has not been parsed yet</span>
              </div>
              <Link href={`/parse?fileId=${file.id}`}>
                <Button className="w-full">
                  <FileTextIcon className="mr-2 h-4 w-4" />
                  Parse File with Llama Cloud
                </Button>
              </Link>
            </div>
          )
        ) : (
          <div className="text-muted-foreground text-sm">Unable to check parse status</div>
        )}
      </div>

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
