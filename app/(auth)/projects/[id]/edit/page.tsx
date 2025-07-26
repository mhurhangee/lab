import { notFound } from 'next/navigation'

import { getProjectAction } from '@/app/actions/projects/get'

import { LabLayout } from '@/components/lab-layout'

import { ProjectForm } from '@/app/(auth)/projects/components/project-form'

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
      pageTitle={`Edit ${project.title}`}
      icon={'folder-edit'}
      backTo={{ href: `/projects/${project.id}`, label: project.title }}
      breadcrumb={[
        { href: '/projects', label: 'Projects' },
        { href: `/projects/${project.id}`, label: project.title },
        { href: `/projects/${project.id}/edit`, label: 'Edit' },
      ]}
      description="Update project details"
    >
      <div className="max-w-2xl py-8">
        <ProjectForm project={project} isEdit={true} />
      </div>
    </LabLayout>
  )
}
