import Link from 'next/link'

import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { LabLayout } from '@/components/lab-layout'

export const dynamic = 'force-dynamic'

export default function Brainstorm() {
  return (
    <LabLayout
      title="Brainstorm"
      pageTitle="Brainstorm"
      icon="lightbulb"
      breadcrumb={[{ href: '/brainstorm', label: 'Brainstorm' }]}
      backTo={{ href: '/dashboard', label: 'Dashboard' }}
      actions={
        <Link href="/brainstorm/new">
          <Button size="sm">
            <PlusIcon className="h-4 w-4" />
            New Brainstorm
          </Button>
        </Link>
      }
    >
      <div>Brainstormer will go here</div>
    </LabLayout>
  )
}
