import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BackToButton } from '@/components/ui/back-to-button'
import { Button } from '@/components/ui/button'

import { LabLayout } from '@/components/lab-layout'

import { formatDate } from '@/lib/date'

import { Edit, FolderIcon } from 'lucide-react'

import { DeleteProjectDialog } from '@/app/(auth)/projects/components/delete-project-dialog'
import { getProjectAction } from '@/app/actions/projects/get'

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
      title={project.title}
      icon={<FolderIcon />}
      actions={
        <div className="flex items-center gap-2">
          <BackToButton href="/projects" label="Projects" />
        </div>
      }
      description={`Created on ${formatDate(project.createdAt.toString())}`}
    >
      <div className="space-y-8 py-8">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Details</h3>
              <div className="space-y-4 rounded-md border p-4">
                <div>
                  <p className="text-muted-foreground text-sm">Title</p>
                  <p className="font-medium">{project.title}</p>
                </div>

                <div>
                  <p className="text-muted-foreground text-sm">Description</p>
                  <p>{project.description || 'No description provided'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground text-sm">Created</p>
                    <p>{formatDate(project.createdAt.toString())}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Last Updated</p>
                    <p>{formatDate(project.updatedAt.toString())}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Actions</h3>
              <div className="space-y-4 rounded-md border p-4">
                <div className="flex flex-col gap-3">
                  <Link href={`/projects/${project.id}/edit`}>
                    <Button className="w-full" variant="outline">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Project
                    </Button>
                  </Link>

                  <DeleteProjectDialog projectId={project.id} size="default" fullWidth />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LabLayout>
  )
}
