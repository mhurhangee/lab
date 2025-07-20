'use client'

import { ColumnDef } from '@tanstack/react-table'

import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { caseInsensitiveSort } from '@/lib/column-sort'
import { formatDate } from '@/lib/date'

import type { ProjectDB } from '@/types/database'

import { ArrowUpDown, FileIcon } from 'lucide-react'

import { ActionsCell } from './actions-cell'

export const columnsProjects: ColumnDef<ProjectDB>[] = [
  {
    accessorKey: 'title',
    sortingFn: caseInsensitiveSort,
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-1">
          Title
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            size="icon"
          >
            <ArrowUpDown />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const title = row.getValue('title')
      return (
        <div className="font-medium">
          <Link href={`/projects/${row.original.id}`}>{title as string}</Link>
        </div>
      )
    },
  },
  {
    accessorKey: 'description',
    sortingFn: caseInsensitiveSort,
    header: 'Description',
    cell: ({ row }) => {
      const description = row.getValue('description')
      return (
        <div className="max-w-[300px] truncate">
          <Link href={`/projects/${row.original.id}`}>{(description as string) || '-'}</Link>
        </div>
      )
    },
  },
  {
    accessorKey: 'fileCount',
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-1">
          Files
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            size="icon"
          >
            <ArrowUpDown />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const fileCount = row.getValue('fileCount')
      return (
        <Link href={`/projects/${row.original.id}`}>
          <Badge>
            <FileIcon />
            {fileCount as number} {fileCount === 1 ? 'file' : 'files'}
          </Badge>
        </Link>
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
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            size="icon"
          >
            <ArrowUpDown />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const updatedAt = row.getValue('updatedAt')
      const formatted = formatDate(updatedAt as string | Date) || '-'
      return <Link href={`/projects/${row.original.id}`}>{formatted}</Link>
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
