'use client'

import { ColumnDef, Row } from '@tanstack/react-table'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { formatDate } from '@/lib/date'

import { ArrowUpDown } from 'lucide-react'

import { ActionsCell } from './actions-cell'

export type ProjectWithFileCount = {
  id: string
  userId: string
  title: string
  description: string | null
  createdAt: Date
  updatedAt: Date
  fileCount: number
}

// Helper function for case-insensitive sorting of string values
const caseInsensitiveSort = (
  rowA: Row<ProjectWithFileCount>,
  rowB: Row<ProjectWithFileCount>,
  columnId: string
) => {
  const valueA = String(rowA.getValue(columnId) || '').toLowerCase()
  const valueB = String(rowB.getValue(columnId) || '').toLowerCase()
  return valueA.localeCompare(valueB)
}

export const columnsWithFileCounts: ColumnDef<ProjectWithFileCount>[] = [
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
      const title = row.getValue('title') as string
      return (
        <div className="font-medium">
          <Link href={`/projects/${row.original.id}`}>{title}</Link>
        </div>
      )
    },
  },
  {
    accessorKey: 'description',
    sortingFn: caseInsensitiveSort,
    header: 'Description',
    cell: ({ row }) => {
      const description = row.getValue('description') as string
      return (
        <div className="max-w-[300px] truncate">
          <Link href={`/projects/${row.original.id}`}>{description || '-'}</Link>
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
      const fileCount = row.getValue('fileCount') as number
      return (
        <div className="text-center">
          <Link href={`/projects/${row.original.id}`}>
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
              {fileCount} {fileCount === 1 ? 'file' : 'files'}
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
      const updatedAt = row.getValue('updatedAt') as string | Date
      const formatted = formatDate(updatedAt.toString()) || '-'
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
