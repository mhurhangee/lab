'use client'

import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { EditIcon, ExternalLinkIcon, TrashIcon } from 'lucide-react'

import { deleteUrlAction } from '@/app/actions/urls/delete'
import { formatDate } from '@/lib/date'
import { formatFileSize } from '@/lib/file-size'

type UrlWithProject = {
  id: string
  name: string
  url: string
  size: number
  type: string
  projectId: string | null
  parsedMarkdown: string | null
  createdAt: Date
  updatedAt: Date
  projectTitle: string | null
}

interface UrlsDataTableProps {
  data: UrlWithProject[]
}

export function UrlsDataTable({ data }: UrlsDataTableProps) {
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this URL?')) {
      await deleteUrlAction(id)
      window.location.reload()
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-muted-foreground py-8 text-center">
                No URLs found.{' '}
                <Link href="/urls/new" className="text-primary hover:underline">
                  Scrape your first URL
                </Link>
              </TableCell>
            </TableRow>
          ) : (
            data.map(url => (
              <TableRow key={url.id}>
                <TableCell className="font-medium">
                  <Link href={`/urls/${url.id}`} className="hover:underline">
                    {url.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground max-w-[200px] truncate text-sm">
                      {url.url}
                    </span>
                    <a
                      href={url.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLinkIcon className="h-3 w-3" />
                    </a>
                  </div>
                </TableCell>
                <TableCell>
                  {url.projectTitle ? (
                    <Badge variant="secondary">{url.projectTitle}</Badge>
                  ) : (
                    <span className="text-muted-foreground">No project</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatFileSize(url.size)}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(url.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/urls/${url.id}`}>
                      <Button variant="ghost" size="sm">
                        <EditIcon className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(url.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
