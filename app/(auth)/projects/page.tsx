import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { ErrorAlert } from '@/components/ui/error-alert'

import { LabLayout } from '@/components/lab-layout'

import { PlusIcon } from 'lucide-react'

import { listProjectsWithFileCountsAction } from '@/app/actions/projects/list-with-file-counts'

import { ProjectsDataTable } from './components/data-table'

export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  const { projects, error } = await listProjectsWithFileCountsAction()

  return (
    <LabLayout
      title="Projects"
      icon="folder"
      breadcrumb={[{ href: '/projects', label: 'Projects' }]}
      backTo={{ href: '/dashboard', label: 'Dashboard' }}
      actions={
        <Link href="/projects/new">
          <Button size="sm">
            <PlusIcon className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      }
      description="Manage, view, and create new projects to help organize your workflows and files."
    >
      {error ? <ErrorAlert error={error} /> : <ProjectsDataTable data={projects || []} />}
    </LabLayout>
  )
}
