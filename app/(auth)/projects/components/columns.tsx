'use client'

import { ColumnDef } from '@tanstack/react-table'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { caseInsensitiveSort } from '@/lib/column-sort'
import { formatDate } from '@/lib/date'

import type { ProjectDB } from '@/types/database'

import { ArrowUpDown } from 'lucide-react'

import { ActionsCell } from './actions-cell'

export const columnsProjects: ColumnDef<ProjectDB>[] = [
  {
    accessorKey: 'title',
    sortingFn: caseInsensitiveSort,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="p-0 font-medium hover:bg-transparent"
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
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
          <Link href={`/projects/${row.original.id}`}>{description as string || '-'}</Link>
        </div>
      )
    },
  },
  {
    accessorKey: 'fileCount',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="p-0 font-medium hover:bg-transparent"
        >
          Files
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const fileCount = row.getValue('fileCount')
      return (
        <div className="text-center">
          <Link href={`/projects/${row.original.id}`}>
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
              {fileCount as number} {fileCount === 1 ? 'file' : 'files'}
            </span>
          </Link>
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
          <Link href={`/projects/${row.original.id}`}>{formatted}</Link>
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
