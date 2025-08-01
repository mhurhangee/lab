import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Edit } from 'lucide-react'

import { getProjectAction } from '@/app/actions/projects/get'

import { Button } from '@/components/ui/button'
import { EntityCard } from '@/components/ui/entity-card'

import { ChatWidget } from '@/components/chat-widget'
import { GenericWidget } from '@/components/generic-widget'
import { LabLayout } from '@/components/lab-layout'

import { formatDate } from '@/lib/date'

import { DeleteProjectDialog } from '@/app/(auth)/projects/components/delete-project-dialog'

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params
  const { project, error } = await getProjectAction({ id })

  if (error || !project) {
    notFound()
  }

  return (
    <LabLayout
      breadcrumb={[
        { href: '/projects', label: 'Projects' },
        { href: `/projects/${project.id}`, label: project.title },
      ]}
      pageTitle={project.title}
      backTo={{ href: '/projects', label: 'All Projects' }}
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

      <div className="grid gap-6 md:grid-cols-2">
        <GenericWidget type="pdfs" limit={3} icon="file" projectId={project.id} />
        <GenericWidget type="urls" limit={3} icon="link" projectId={project.id} />
        <GenericWidget type="docs" limit={3} icon="file-text" projectId={project.id} />
        <ChatWidget limit={3} projectId={project.id} />
      </div>
    </LabLayout>
  )
}
