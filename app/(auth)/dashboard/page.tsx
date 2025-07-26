import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { LabLayout } from '@/components/lab-layout'

import { ContextsWidget } from './components/contexts-widget'
import { ProjectsWidget } from './components/projects-widget'

export default function DashboardPage() {
  return (
    <LabLayout
      title="Dashboard"
      pageTitle="Dashboard"
      description="Welcome to Superfier lab"
      icon="layout-grid"
      backTo={{ href: '/faq', label: 'FAQ' }}
      breadcrumb={[{ href: '/dashboard', label: 'Dashboard' }]}
      actions={
        <div className="flex items-center gap-2">
          <Link href="/projects/new">
            <Button size="sm">New Project</Button>
          </Link>
          <Link href="/contexts">
            <Button size="sm" variant="outline">
              New Context
            </Button>
          </Link>
        </div>
      }
    >
      <div className="grid gap-6 md:grid-cols-2">
        <ProjectsWidget />
        <ContextsWidget />
      </div>
    </LabLayout>
  )
}
