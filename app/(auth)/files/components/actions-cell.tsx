'use client'

import { Row } from '@tanstack/react-table'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { Edit, Eye } from 'lucide-react'

import { File } from './columns'
import { DeleteFileDialog } from './delete-file-dialog'

export function ActionsCell({ row }: { row: Row<File> }) {
  const file = row.original

  return (
    <div className="flex items-center justify-end">
      <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
        <Link href={`/files/${file.id}`} className="flex items-center">
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
        <Link href={`/files/${file.id}/edit`} className="flex items-center">
          <Edit className="h-4 w-4" />
        </Link>
      </Button>
      <DeleteFileDialog fileId={file.id} size="icon" />
    </div>
  )
}
