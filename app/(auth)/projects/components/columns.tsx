'use client'

import { ColumnDef, Row } from '@tanstack/react-table'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { formatDate } from '@/lib/date'

import { ArrowUpDown } from 'lucide-react'

import { ActionsCell } from './actions-cell'

export type Project = {
  id: string
  title: string
  description: string | null
  createdAt: string | Date
  updatedAt: string | Date
}

// Helper function for case-insensitive sorting of string values
const caseInsensitiveSort = (rowA: Row<Project>, rowB: Row<Project>, columnId: string) => {
  const valueA = String(rowA.getValue(columnId) || '').toLowerCase()
  const valueB = String(rowB.getValue(columnId) || '').toLowerCase()
  return valueA.localeCompare(valueB)
}

export const columns: ColumnDef<Project>[] = [
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
