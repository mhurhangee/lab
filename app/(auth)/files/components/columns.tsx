'use client'

import { ColumnDef } from '@tanstack/react-table'

import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { caseInsensitiveSort } from '@/lib/column-sort'
import { formatDate } from '@/lib/date'

import type { FileDB } from '@/types/database'

import { ArrowUpDown, CheckCircleIcon, FolderIcon } from 'lucide-react'

import { ActionsCell } from './actions-cell'

export const columnsFiles: ColumnDef<FileDB>[] = [
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
      const type = row.getValue('type')
      return (
        <div className="font-medium">
          {type === 'url' ? (
            <Link href={`/urls/${row.original.id}`}>{name as string}</Link>
          ) : (
            <Link href={`/files/${row.original.id}`}>{name as string}</Link>
          )}
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
      const type = row.getValue('type')
      return (
        <div className="max-w-[200px] truncate">
          {type === 'url' ? (
            <Link href={`/urls/${row.original.id}`}>
              <Badge>
                <FolderIcon />
                {projectTitle as string}
              </Badge>
            </Link>
          ) : (
            <Link href={`/projects/${projectId}`}>
              <Badge>
                <FolderIcon />
                {projectTitle as string}
              </Badge>
            </Link>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'type',
    sortingFn: caseInsensitiveSort,
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('type')
      return (
        <div className="max-w-[300px] truncate">
          {type === 'url' ? (
            <Link href={`/urls/${row.original.id}`}>{(type as string) || '-'}</Link>
          ) : (
            <Link href={`/files/${row.original.id}`}>{(type as string) || '-'}</Link>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-1">
          Last Updated
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
      const formatted = formatDate(updatedAt as string | Date) || '-'
      return (
        <div>
          <Link href={`/files/${row.original.id}`}>{formatted}</Link>
        </div>
      )
    },
  },
  {
    accessorKey: 'parsedMarkdown',
    header: 'Parsed',
    cell: ({ row }) => {
      const parsed = row.getValue('parsedMarkdown')
      return (
        <div className="flex max-w-[50px] items-center justify-center truncate">
          {parsed ? (
            <Link href={`/files/${row.original.id}`}>
              <CheckCircleIcon className="h-4 w-4 text-green-600" />
            </Link>
          ) : (
            <span className="text-muted-foreground">-</span>
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
