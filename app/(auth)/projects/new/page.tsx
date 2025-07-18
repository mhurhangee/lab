import { LabLayout } from '@/components/lab-layout'
import { BackToButton } from '@/components/ui/back-to-button'
import { ProjectForm } from '@/app/(auth)/projects/components/project-form'
import { PlusIcon } from 'lucide-react'

export default function NewProjectPage() {
  return (
    <LabLayout
      title="New Project"
      icon={<PlusIcon />}
      actions={<BackToButton href="/projects" label="Projects" />}
      description="Create a new project"
    >
      <div className="py-8 max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">New Project</h2>
        <p className="text-muted-foreground mb-4">Projects are used to group related tasks and manage your workflow. You can create as many projects as you need.</p>
        <ProjectForm />
      </div>
    </LabLayout>
  )
}
