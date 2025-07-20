import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { LabLayout } from '@/components/lab-layout'

import { FilesWidget } from './components/files-widget'
import { ProjectsWidget } from './components/projects-widget'

export default function DashboardPage() {
  return (
    <LabLayout
      title="Dashboard"
      description="Welcome to Superfier lab"
      icon="layout-grid"
      backToHref="/"
      backToLabel="Home"
      breadcrumb={[{ href: '/dashboard', label: 'Dashboard' }]}
      actions={
        <div className="flex items-center gap-2">
          <Link href="/projects/new">
            <Button size="sm">New Project</Button>
          </Link>
          <Link href="/files/new">
            <Button size="sm" variant="outline">
              New File
            </Button>
          </Link>
        </div>
      }
    >
      <div className="grid gap-6 md:grid-cols-2">
        <ProjectsWidget />
        <FilesWidget />
      </div>
    </LabLayout>
  )
}
