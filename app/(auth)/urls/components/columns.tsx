'use client'

import { ColumnDef } from '@tanstack/react-table'

import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { caseInsensitiveSort } from '@/lib/column-sort'
import { formatDate } from '@/lib/date'

import type { ContextDB } from '@/types/database'

import { ArrowUpDown, CheckCircleIcon, ExternalLinkIcon, FolderIcon } from 'lucide-react'

import { ActionsCell } from './actions-cell'

export const columnsUrls: ColumnDef<ContextDB>[] = [
  {
    accessorKey: 'name',
    sortingFn: caseInsensitiveSort,
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-1">
          Name
          <Button
            variant="ghost"
            size="icon"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <ArrowUpDown />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const name = row.getValue('name')
      return (
        <div className="font-medium">
          <Link href={`/urls/${row.original.id}`}>{name as string}</Link>
        </div>
      )
    },
  },
  {
    accessorKey: 'url',
    sortingFn: caseInsensitiveSort,
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-1">
          URL
          <Button
            variant="ghost"
            size="icon"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <ArrowUpDown />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const url = row.getValue('url')
      return (
        <div className="flex max-w-[300px] items-center gap-2">
          <span className="text-muted-foreground truncate text-sm">{url as string}</span>
          <a
            href={url as string}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <ExternalLinkIcon className="h-3 w-3" />
          </a>
        </div>
      )
    },
  },
  {
    accessorKey: 'projectTitle',
    sortingFn: caseInsensitiveSort,
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-1">
          Project
          <Button
            variant="ghost"
            size="icon"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <ArrowUpDown />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const projectTitle = row.getValue('projectTitle')
      const projectId = row.original.projectId
      return (
        <div className="max-w-[200px] truncate">
          {projectTitle && projectId ? (
            <Link href={`/projects/${projectId}`}>
              <Badge>
                <FolderIcon />
                {projectTitle as string}
              </Badge>
            </Link>
          ) : (
            <span className="text-muted-foreground">No project</span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'updatedAt',
    sortingFn: caseInsensitiveSort,
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-1">
          Updated
          <Button
            variant="ghost"
            size="icon"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <ArrowUpDown />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const updatedAt = row.getValue('updatedAt')
      return <div className="text-muted-foreground text-sm">{formatDate(updatedAt as Date)}</div>
    },
  },
  {
    accessorKey: 'parsedMarkdown',
    header: 'Scraped',
    cell: ({ row }) => {
      const parsedMarkdown = row.getValue('parsedMarkdown')
      return (
        <div className="flex items-center">
          {parsedMarkdown ? (
            <CheckCircleIcon className="h-4 w-4 text-green-600" />
          ) : (
            <div className="border-muted h-4 w-4 rounded-full border-2" />
          )}
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: () => {
      return <div className="text-right">Actions</div>
    },
    cell: ({ row }) => <ActionsCell row={row} />,
  },
]
