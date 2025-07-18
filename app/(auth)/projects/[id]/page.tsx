import { notFound } from 'next/navigation'
import { LabLayout } from '@/components/lab-layout'
import { Button } from '@/components/ui/button'
import { BackToButton } from '@/components/ui/back-to-button'
import { getProjectAction } from '@/app/actions/projects/get'
import { FolderIcon, Edit } from 'lucide-react'
import Link from 'next/link'
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
      title={project.title}
      icon={<FolderIcon />}
      actions={
        <div className="flex items-center gap-2">
          <BackToButton href="/projects" label="Projects" />
        </div>
      }
      description={`Created on ${formatDate(project.createdAt.toString())}`}
    >
      <div className="py-8 space-y-8">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Details</h3>
              <div className="border rounded-md p-4 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Title</p>
                  <p className="font-medium">{project.title}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p>{project.description || 'No description provided'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p>{formatDate(project.createdAt.toString())}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p>{formatDate(project.updatedAt.toString())}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Actions</h3>
              <div className="border rounded-md p-4 space-y-4">
                <div className="flex flex-col gap-3">
                  <Link href={`/projects/${project.id}/edit`}>
                    <Button className="w-full" variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
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