import Link from 'next/link'
import { notFound } from 'next/navigation'

import { EditIcon, EyeIcon, LinkIcon, Volume2Icon } from 'lucide-react'

import { deleteContextsAction } from '@/app/actions/contexts/delete'
import { getContextsWithProjectAction } from '@/app/actions/contexts/get-with-project'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EntityCard } from '@/components/ui/entity-card'
import { ErrorAlert } from '@/components/ui/error-alert'
import { Markdown } from '@/components/ui/markdown'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { DeleteContextsDialog } from '@/components/delete-contexts-dialog'
import { LabLayout } from '@/components/lab-layout'

import { formatDate } from '@/lib/date'
import { formatFileSize } from '@/lib/file-size'

interface UrlPageProps {
  params: Promise<{ id: string }>
}

export default async function UrlPage({ params }: UrlPageProps) {
  const { id } = await params
  const { context: url, error } = await getContextsWithProjectAction({ id, type: 'urls' })

  if (error) {
    return (
      <LabLayout pageTitle="URL" title="URL" icon="link">
        <ErrorAlert error={error} />
      </LabLayout>
    )
  }

  if (!url) {
    notFound()
  }

  return (
    <LabLayout
      breadcrumb={[
        { href: '/urls', label: 'URLs' },
        { href: `/urls/${url.id}`, label: url.name },
      ]}
      pageTitle={url.name}
      icon="link"
      backTo={{ href: '/urls', label: 'All URLs' }}
    >
      <EntityCard
        title="URL Details"
        icon="link"
        attributes={[
          {
            id: 'name',
            label: 'Name',
            value: url.name,
            icon: 'file-text',
          },
          {
            id: 'url',
            label: 'Original URL',
            value: url.url,
            icon: 'link',
          },
          {
            id: 'size',
            label: 'Size',
            value: formatFileSize(url.size),
            icon: 'file-text',
          },
          {
            id: 'updated',
            label: 'Updated',
            value: formatDate(url.updatedAt),
            icon: 'calendar',
          },
        ]}
        badges={[
          {
            label: url.projectTitle ? url.projectTitle : 'No project',
            variant: url.projectTitle ? 'default' : 'destructive',
          },
        ]}
        tags={[
          {
            label: 'URL',
          },
        ]}
        actionButtons={
          <>
            <Link href={`/urls/${url.id}/edit`}>
              <Button size="sm">
                <EditIcon className="h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Link href={url.url} target="_blank" rel="noopener noreferrer">
              <Button size="icon" variant="ghost">
                <EyeIcon className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/text-to-speech?fileId=${url.id}`}>
              <Button size="icon" variant="ghost" title="Convert to speech">
                <Volume2Icon className="h-4 w-4" />
              </Button>
            </Link>
            <DeleteContextsDialog
              contextsId={url.id}
              type="urls"
              size="icon"
              action={deleteContextsAction}
            />
          </>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            URL Content
          </CardTitle>
          <CardDescription>Markdown content of the URL</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="rendered">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="rendered">Rendered</TabsTrigger>
              <TabsTrigger value="raw">Raw</TabsTrigger>
            </TabsList>
            <TabsContent value="rendered">
              <Markdown>{url.parsedMarkdown || ''}</Markdown>
            </TabsContent>
            <TabsContent value="raw">
              <pre className="whitespace-pre-wrap">{url.parsedMarkdown || ''}</pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </LabLayout>
  )
}
