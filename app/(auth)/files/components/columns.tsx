'use client'

import { ColumnDef } from '@tanstack/react-table'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { caseInsensitiveSort } from '@/lib/column-sort'
import { formatDate } from '@/lib/date'

import type { FileDB } from '@/types/database'

import { ArrowUpDown } from 'lucide-react'

import { ActionsCell } from './actions-cell'

export const columnsFiles: ColumnDef<FileDB>[] = [
  {
    accessorKey: 'name',
    sortingFn: caseInsensitiveSort,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="p-0 font-medium hover:bg-transparent"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
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
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="p-0 font-medium hover:bg-transparent"
        >
          Project
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const projectTitle = row.getValue('projectTitle')
      const projectId = row.original.projectId
      return (
        <div className="max-w-[200px] truncate">
          {projectTitle && projectId ? (
            <Link href={`/projects/${projectId}`} className="text-blue-600 hover:underline">
              {projectTitle as string}
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
          <Link href={`/files/${row.original.id}`}>{type as string || '-'}</Link>
        </div>
      )
    },
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="p-0 font-medium hover:bg-transparent"
        >
          Last Updated
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
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
    header: 'Actions',
    cell: ({ row }) => <ActionsCell row={row} />,
  },
]
