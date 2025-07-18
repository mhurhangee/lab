import { BackToButton } from '@/components/ui/back-to-button'

import { LabLayout } from '@/components/lab-layout'

import { PlusIcon } from 'lucide-react'

import { ProjectForm } from '@/app/(auth)/projects/components/project-form'

export default function NewProjectPage() {
  return (
    <LabLayout
      title="New Project"
      icon={<PlusIcon />}
      actions={<BackToButton href="/projects" label="Projects" />}
      description="Create a new project"
    >
      <div className="max-w-2xl py-8">
        <h2 className="mb-4 text-2xl font-bold">New Project</h2>
        <p className="text-muted-foreground mb-4">
          Projects are used to group related tasks and manage your workflow. You can create as many
          projects as you need.
        </p>
        <ProjectForm />
      </div>
    </LabLayout>
  )
}
