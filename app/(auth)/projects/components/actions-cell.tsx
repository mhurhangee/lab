'use client'

import { Row } from '@tanstack/react-table'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { ProjectDB } from '@/types/database'

import { Edit, Eye } from 'lucide-react'

import { DeleteProjectDialog } from '@/app/(auth)/projects/components/delete-project-dialog'

export function ActionsCell({ row }: { row: Row<ProjectDB> }) {
  const project = row.original

  return (
    <div className="flex items-center justify-end">
      <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
        <Link href={`/projects/${project.id}`} className="flex items-center">
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
        <Link href={`/projects/${project.id}/edit`} className="flex items-center">
          <Edit className="h-4 w-4" />
        </Link>
      </Button>
      <DeleteProjectDialog projectId={project.id} size="icon" />
    </div>
  )
}
