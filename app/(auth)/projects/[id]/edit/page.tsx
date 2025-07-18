import { notFound } from 'next/navigation'

import { BackToButton } from '@/components/ui/back-to-button'

import { LabLayout } from '@/components/lab-layout'

import { Edit } from 'lucide-react'

import { ProjectForm } from '@/app/(auth)/projects/components/project-form'
import { getProjectAction } from '@/app/actions/projects/get'

interface EditProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { project, error } = await getProjectAction({ id: (await params).id })

  if (error || !project) {
    notFound()
  }

  return (
    <LabLayout
      title={`Edit ${project.title}`}
      icon={<Edit />}
      actions={<BackToButton href={`/projects/${(await params).id}`} label="Back to Project" />}
      description="Update project details"
    >
      <div className="max-w-2xl py-8">
        <ProjectForm project={project} isEdit={true} />
      </div>
    </LabLayout>
  )
}
