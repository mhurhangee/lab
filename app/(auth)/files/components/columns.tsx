'use client'

import { ColumnDef, Row } from '@tanstack/react-table'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { formatDate } from '@/lib/date'

import { ArrowUpDown } from 'lucide-react'

import { files } from '@/schema'

import { ActionsCell } from './actions-cell'

export type FileRecord = typeof files.$inferSelect

// Helper function for case-insensitive sorting of string values
const caseInsensitiveSort = (rowA: Row<FileRecord>, rowB: Row<FileRecord>, columnId: string) => {
  const valueA = String(rowA.getValue(columnId) || '').toLowerCase()
  const valueB = String(rowB.getValue(columnId) || '').toLowerCase()
  return valueA.localeCompare(valueB)
}

export const columns: ColumnDef<FileRecord>[] = [
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
