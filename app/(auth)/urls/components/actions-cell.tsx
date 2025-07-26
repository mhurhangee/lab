'use client'

import Link from 'next/link'

import { EditIcon, ExternalLinkIcon, MoreHorizontalIcon } from 'lucide-react'

import { deleteContextsAction } from '@/app/actions/contexts/delete'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { DeleteContextsDialog } from '@/components/delete-contexts-dialog'

import type { ContextDB } from '@/types/database'

interface ActionsCellProps {
  row: { original: ContextDB }
}

export function ActionsCell({ row }: ActionsCellProps) {
  const url = row.original

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
          <DeleteContextsDialog
            contextsId={url.id}
            type="urls"
            size="icon"
            action={deleteContextsAction}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
