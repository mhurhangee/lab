'use client'

import { ColumnDef } from '@tanstack/react-table'

import Link from 'next/link'

import { ArrowUpDown, FolderIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { caseInsensitiveSort } from '@/lib/column-sort'
import { formatDate } from '@/lib/date'

import type { ChatDB } from '@/types/database'

import { UIMessage } from 'ai'

import { ActionsCell } from './actions-cell'

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
          {projectId ? (
            <Link href={`/projects/${projectId}`}>
              <Badge variant="outline">
                <FolderIcon />
                {projectTitle ? (projectTitle as string) : '-'}
              </Badge>
            </Link>
          ) : (
            <Badge variant="outline">
              <FolderIcon />
              {projectTitle ? (projectTitle as string) : '-'}
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'messages',
    header: 'Messages',
    cell: ({ row }) => {
      const messages: UIMessage[] = row.getValue('messages')
      return (
        <div className="flex max-w-[50px] justify-end truncate font-medium">
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
