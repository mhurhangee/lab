'use client'

import { ColumnDef } from '@tanstack/react-table'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { caseInsensitiveSort } from '@/lib/column-sort'
import { formatDate } from '@/lib/date'

import type { ChatDB } from '@/types/database'

import { ArrowUpDown } from 'lucide-react'

import { ActionsCell } from './actions-cell'

import { UIMessage } from 'ai'

export const columnsChats: ColumnDef<ChatDB>[] = [
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
          <Link href={`/chat/${row.original.id}`}>{title as string}</Link>
        </div>
      )
    },
  },
  {
    accessorKey: 'messages',
    header: 'Messages',
    cell: ({ row }) => {
      const messages = row.getValue('messages') as UIMessage[]
      return (
        <div className="font-medium flex max-w-[50px] justify-end truncate">
          <Link href={`/chat/${row.original.id}`}>{messages.length}</Link>
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
