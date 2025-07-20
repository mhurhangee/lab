import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { EntityCard } from '@/components/ui/entity-card'

import { LabLayout } from '@/components/lab-layout'

import { formatDate } from '@/lib/date'

import { Edit } from 'lucide-react'

import { FilesDataTable } from '@/app/(auth)/files/components/data-table'
import { DeleteProjectDialog } from '@/app/(auth)/projects/components/delete-project-dialog'
import { listFilesByProjectAction } from '@/app/actions/files/list-by-project'
import { getProjectAction } from '@/app/actions/projects/get'

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params
  const [{ project, error }, { files = [] }] = await Promise.all([
    getProjectAction({ id }),
    listFilesByProjectAction({ projectId: id }),
  ])

  if (error || !project) {
    notFound()
  }

  return (
    <LabLayout
      breadcrumb={[
        { href: '/projects', label: 'Projects' },
        { href: `/projects/${project.id}`, label: project.title },
      ]}
      backToHref="/projects"
      backToLabel="All Projects"
    >
      <EntityCard
        title={project.title}
        description={project.description || 'No description'}
        icon={'folder-dot'}
        attributes={[
          { id: 'id', label: 'ID', value: project.id, icon: 'file-text' },
          {
            id: 'createdAt',
            label: 'Created at',
            value: formatDate(project.createdAt),
            icon: 'calendar',
          },
          {
            id: 'updatedAt',
            label: 'Updated at',
            value: formatDate(project.updatedAt),
            icon: 'calendar',
          },
          { id: 'filesCount', label: 'Files', value: files.length, icon: 'file-text' },
        ]}
        badges={[{ label: 'Active', variant: 'default' }]}
        tags={[{ label: 'Project' }, { label: 'Files' }]}
        actionButtons={
          <>
            <Link href={`/projects/${project.id}/edit`}>
              <Button size="icon" variant="ghost">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <DeleteProjectDialog projectId={project.id} size="icon" />
          </>
        }
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Files ({files.length})</h3>
          <Link href="/files/new">
            <Button>Add File</Button>
          </Link>
        </div>
        <FilesDataTable data={files} hideProject />
      </div>
    </LabLayout>
  )
}
