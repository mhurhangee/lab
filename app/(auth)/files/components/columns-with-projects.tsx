'use client'

import { ColumnDef, Row } from '@tanstack/react-table'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { formatDate } from '@/lib/date'

import { ArrowUpDown } from 'lucide-react'

import { ActionsCell } from './actions-cell'

export type FileRecordWithProject = {
  id: string
  userId: string
  name: string
  url: string
  size: number
  type: string
  projectId: string | null
  createdAt: Date
  updatedAt: Date
  projectTitle: string | null
}

// Helper function for case-insensitive sorting of string values
const caseInsensitiveSort = (
  rowA: Row<FileRecordWithProject>,
  rowB: Row<FileRecordWithProject>,
  columnId: string
) => {
  const valueA = String(rowA.getValue(columnId) || '').toLowerCase()
  const valueB = String(rowB.getValue(columnId) || '').toLowerCase()
  return valueA.localeCompare(valueB)
}

export const columnsWithProjects: ColumnDef<FileRecordWithProject>[] = [
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
      const name = row.getValue('name') as string
      return (
        <div className="font-medium">
          <Link href={`/files/${row.original.id}`}>{name}</Link>
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
      const projectTitle = row.getValue('projectTitle') as string | null
      const projectId = row.original.projectId
      return (
        <div className="max-w-[200px] truncate">
          {projectTitle && projectId ? (
            <Link href={`/projects/${projectId}`} className="text-blue-600 hover:underline">
              {projectTitle}
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
      const type = row.getValue('type') as string
      return (
        <div className="max-w-[300px] truncate">
          <Link href={`/files/${row.original.id}`}>{type || '-'}</Link>
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
