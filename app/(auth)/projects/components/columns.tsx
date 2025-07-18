'use client'

import { ColumnDef } from '@tanstack/react-table'

import { formatDate } from '@/lib/date'

import { ActionsCell } from './data-table'

import Link from 'next/link'

export type Project = {
  id: string
  title: string
  description: string | null
  createdAt: string | Date
  updatedAt: string | Date
}

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      const title = row.getValue('title') as string
      return <div className="font-medium"><Link href={`/projects/${row.original.id}`}>{title}</Link></div>
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const description = row.getValue('description') as string
      return <div className="max-w-[300px] truncate"><Link href={`/projects/${row.original.id}`}>{description || '-'}</Link></div>
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'Last Updated',
    cell: ({ row }) => {
      const updatedAt = row.getValue('updatedAt') as string | Date
      const formatted = formatDate(updatedAt.toString()) || '-'
      return <div><Link href={`/projects/${row.original.id}`}>{formatted}</Link></div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell row={row} />,
  },
]
