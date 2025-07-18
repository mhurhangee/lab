import { notFound } from 'next/navigation'
import { LabLayout } from '@/components/lab-layout'
import { BackToButton } from '@/components/ui/back-to-button'
import { ProjectForm } from '@/app/(auth)/projects/components/project-form'
import { getProjectAction } from '@/app/actions/projects/get'
import { Edit } from 'lucide-react'

interface EditProjectPageProps {
  params: Promise<{id: string}>
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
      <div className="py-8 max-w-2xl">
        <ProjectForm project={project} isEdit={true} />
      </div>
    </LabLayout>
  )
}
