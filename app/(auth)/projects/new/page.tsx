import { LabLayout } from '@/components/lab-layout'

import { ProjectForm } from '@/app/(auth)/projects/components/project-form'

export default function NewProjectPage() {
  return (
    <LabLayout
      title="Create a new project"
      icon={'folder-plus'}
      backTo={{ href: '/projects', label: 'Projects' }}
      breadcrumb={[
        { href: '/projects', label: 'Projects' },
        { href: '/projects/new', label: 'New' },
      ]}
      description="Projects are used to group related tasks and manage your workflow. You can create as many projects as you need."
    >
      <ProjectForm />
    </LabLayout>
  )
}
