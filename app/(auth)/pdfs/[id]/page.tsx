import Link from 'next/link'
import { notFound } from 'next/navigation'

import {
  CheckCircleIcon,
  DownloadIcon,
  EditIcon,
  FileIcon,
  FileTextIcon,
  Volume2Icon,
} from 'lucide-react'

import { deleteContextsAction } from '@/app/actions/contexts/delete'
import { getContextsAction } from '@/app/actions/contexts/get'
import { getParseStatusAction } from '@/app/actions/contexts/parse'

import { Button } from '@/components/ui/button'
import { ButtonTT } from '@/components/ui/button-tt'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { EntityCard } from '@/components/ui/entity-card'
import { ErrorAlert } from '@/components/ui/error-alert'

import { DeleteContextsDialog } from '@/components/delete-contexts-dialog'
import { LabLayout } from '@/components/lab-layout'

import { formatDate } from '@/lib/date'
import { formatFileSize } from '@/lib/file-size'

interface PdfPageProps {
  params: Promise<{ id: string }>
}

export default async function PdfPage({ params }: PdfPageProps) {
  const { id } = await params
  const { context, error } = await getContextsAction({ id })

  // Get parse status
  const parseStatus = context ? await getParseStatusAction({ contextId: context.id }) : null

  if (error) {
    return (
      <LabLayout title="PDF" icon="file">
        <ErrorAlert error={error} />
      </LabLayout>
    )
  }

  if (!context) {
    notFound()
  }

  // Helper function to render parse status content
  const renderParseStatusContent = () => {
    if (!parseStatus?.success) {
      return <div className="text-muted-foreground text-sm">Unable to check parse status</div>
    }

    if (!parseStatus.isParsed) {
      return (
        <div className="text-muted-foreground flex items-center gap-2">
          <span className="text-sm">File has not been parsed yet</span>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircleIcon className="h-4 w-4" />
          <span className="text-sm font-medium">File has been parsed</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Parsed Content:</span>
            <div className="flex gap-2">
              <Link href={`/text-to-speech?id=${context.id}`}>
                <Button variant="outline" size="sm">
                  <Volume2Icon className="mr-2 h-4 w-4" />
                  Listen
                </Button>
              </Link>
              <Link href={`/parse?id=${context.id}`}>
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
    )
  }

  // Helper function to render parse status footer
  const renderParseStatusFooter = () => {
    if (!parseStatus?.success) {
      return <div className="text-muted-foreground text-sm">Unable to check parse status</div>
    }

    const buttonContent = (
      <>
        <FileTextIcon className="h-4 w-4" />
        {parseStatus.isParsed ? 'View/Edit Parse' : 'Parse File'}
      </>
    )

    return (
      <Link href={`/parse?id=${context.id}`}>
        <Button>{buttonContent}</Button>
      </Link>
    )
  }

  return (
    <LabLayout
      breadcrumb={[
        { href: '/pdfs', label: 'PDFs' },
        { href: `/pdfs/${context.id}`, label: context.name },
      ]}
      icon="file"
      backTo={{ href: '/pdfs', label: 'All PDFs' }}
    >
      <EntityCard
        title={context.name}
        description={context.type.slice(0, -1).toUpperCase()}
        icon="file"
        attributes={[
          { id: 'id', label: 'ID', value: context.id, icon: 'key' },
          {
            id: 'updatedAt',
            label: 'Updated at',
            value: formatDate(context.updatedAt),
            icon: 'calendar',
          },
          { id: 'size', label: 'Size', value: formatFileSize(context.size), icon: 'hard-drive' },
          {
            id: 'type',
            label: 'Type',
            value: context.type.slice(0, -1).toUpperCase(),
            icon: 'file',
          },
        ]}
        badges={[{ label: 'Active', variant: 'default' }]}
        tags={[{ label: 'File' }, { label: 'PDF' }, { label: 'Context' }]}
        actionButtons={
          <>
            <Link href={`/pdfs/${context.id}/edit`}>
              <ButtonTT size="icon" variant="ghost" tooltip="Edit">
                <EditIcon className="h-4 w-4" />
              </ButtonTT>
            </Link>
            <Link href={context.url} target="_blank" rel="noopener noreferrer">
              <ButtonTT size="icon" variant="ghost" tooltip="Download">
                <DownloadIcon className="h-4 w-4" />
              </ButtonTT>
            </Link>
            <Link href={`/parse?id=${context.id}`}>
              <ButtonTT
                size="icon"
                variant="ghost"
                tooltip={
                  parseStatus?.success && parseStatus.isParsed ? 'View parsed content' : 'Parse'
                }
              >
                {parseStatus?.success && parseStatus.isParsed ? (
                  <CheckCircleIcon className="h-4 w-4 text-green-600" />
                ) : (
                  <FileTextIcon className="h-4 w-4" />
                )}
              </ButtonTT>
            </Link>
            {parseStatus?.success && parseStatus.isParsed && (
              <Link href={`/text-to-speech?id=${context.id}`}>
                <ButtonTT size="icon" variant="ghost" tooltip="Convert to speech">
                  <Volume2Icon className="h-4 w-4" />
                </ButtonTT>
              </Link>
            )}
            <DeleteContextsDialog
              contextsId={context.id}
              size="icon"
              type="pdfs"
              action={deleteContextsAction}
            />
          </>
        }
      />

      {/* Parse Status Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileIcon className="h-5 w-5" />
            Parse Status
          </CardTitle>
        </CardHeader>
        <CardContent>{renderParseStatusContent()}</CardContent>
        <CardFooter className="flex items-center justify-between">
          {renderParseStatusFooter()}
        </CardFooter>
      </Card>
    </LabLayout>
  )
}
