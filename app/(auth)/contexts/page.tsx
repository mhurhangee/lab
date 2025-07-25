import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { LabLayout } from '@/components/lab-layout'

export default function ContextsPage() {
  return (
    <LabLayout
      title="Contexts"
      description="Contexts are files and urls that are used to provide context to your projects."
      icon="layers"
      backTo={{ href: '/dashboard', label: 'Dashboard' }}
      breadcrumb={[{ href: '/contexts', label: 'Contexts' }]}
      actions={
        <div className="flex items-center gap-2">
          <Link href="/files/new">
            <Button size="sm">New Files</Button>
          </Link>
          <Link href="/urls/new">
            <Button size="sm" variant="outline">
              New URL
            </Button>
          </Link>
        </div>
      }
    >
      <div className="grid gap-6 md:grid-cols-2"></div>
    </LabLayout>
  )
}
