'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import type { ContextDB } from '@/types/database'

import { EditIcon, ExternalLinkIcon, MoreHorizontalIcon, TrashIcon } from 'lucide-react'

import { deleteUrlAction } from '@/app/actions/urls/delete'

interface ActionsCellProps {
  row: { original: ContextDB }
}

export function ActionsCell({ row }: ActionsCellProps) {
  const url = row.original

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this URL?')) {
      await deleteUrlAction(url.id)
      window.location.reload()
    }
  }

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/urls/${url.id}`}>
              <ExternalLinkIcon className="mr-2 h-4 w-4" />
              View
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/urls/${url.id}/edit`}>
              <EditIcon className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-destructive">
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
