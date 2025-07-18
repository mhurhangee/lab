import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { ErrorAlert } from '@/components/ui/error-alert'

import { LabLayout } from '@/components/lab-layout'

import { FolderIcon, PlusIcon } from 'lucide-react'

import { DataTable } from '@/app/(auth)/projects/components/data-table'
import { listProjectsAction } from '@/app/actions/projects/list'

export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  const { projects, error } = await listProjectsAction()

  return (
    <LabLayout
      title="Projects"
      icon={<FolderIcon />}
      actions={
        <div className="flex items-center gap-2">
          <Link href="/projects/new">
            <Button size="sm">
              <PlusIcon className="h-4 w-4" />
              New Project
            </Button>
          </Link>
        </div>
      }
      description="Manage your projects"
    >
      <div className="max-w-2xl py-8">
        <h1 className="page-title">Projects</h1>
        <p className="page-subtitle">
          See and manage your projects. You can create as many projects as you need.
        </p>
      </div>
      <div className="space-y-8 py-8">
        {error ? <ErrorAlert error={error} /> : <DataTable data={projects || []} />}
      </div>
    </LabLayout>
  )
}
