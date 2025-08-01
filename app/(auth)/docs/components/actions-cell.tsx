'use client'

import { Row } from '@tanstack/react-table'

import Link from 'next/link'

import { Edit, Eye } from 'lucide-react'

import { deleteContextsAction } from '@/app/actions/contexts/delete'

import { Button } from '@/components/ui/button'

import { DeleteContextsDialog } from '@/components/delete-contexts-dialog'

import { ContextDB } from '@/types/database'

export function ActionsCell({ row }: { row: Row<ContextDB> }) {
  const context = row.original

  return (
    <div className="flex items-center justify-end">
      <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
        <Link href={`/docs/${context.id}`} className="flex items-center">
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
        <Link href={`/docs/${context.id}/edit`} className="flex items-center">
          <Edit className="h-4 w-4" />
        </Link>
      </Button>
      <DeleteContextsDialog
        contextsId={context.id}
        size="icon"
        type="docs"
        action={deleteContextsAction}
      />
    </div>
  )
}
