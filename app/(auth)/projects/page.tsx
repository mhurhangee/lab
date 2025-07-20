import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { ErrorAlert } from '@/components/ui/error-alert'

import { LabLayout } from '@/components/lab-layout'

import { PlusIcon } from 'lucide-react'

import { listProjectsWithFileCountsAction } from '@/app/actions/projects/list-with-file-counts'

import { DataTableWithFileCounts } from './components/data-table-with-file-counts'

export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  const { projects, error } = await listProjectsWithFileCountsAction()

  return (
    <LabLayout
      title="Projects"
      icon="folder"
      breadcrumb={[{ href: '/projects', label: 'Projects' }]}
      backToHref="/"
      backToLabel="Dashboard"
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
      description="Manage, view, and create new projects to help organize your workflows and files."
    >
      <div className="space-y-8 py-8">
        {error ? <ErrorAlert error={error} /> : <DataTableWithFileCounts data={projects || []} />}
      </div>
    </LabLayout>
  )
}
