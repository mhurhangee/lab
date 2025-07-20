'use client'

import { ColumnDef } from '@tanstack/react-table'

import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { caseInsensitiveSort } from '@/lib/column-sort'
import { formatDate } from '@/lib/date'

import type { FileDB } from '@/types/database'

import { ArrowUpDown , FolderIcon } from 'lucide-react'

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
      return (
        <div className="font-medium">
          <Link href={`/files/${row.original.id}`}>{name as string}</Link>
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
    accessorKey: 'type',
    sortingFn: caseInsensitiveSort,
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('type')
      return (
        <div className="max-w-[300px] truncate">
          <Link href={`/files/${row.original.id}`}>{(type as string) || '-'}</Link>
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
    id: 'actions',
    header: () => {
      return <div className="text-right">Actions</div>
    },
    cell: ({ row }) => <ActionsCell row={row} />,
  },
]
