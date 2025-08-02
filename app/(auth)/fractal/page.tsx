import Link from 'next/link'

import { PlusIcon } from 'lucide-react'

import { listContextsByTypeWithProjectsAction } from '@/app/actions/contexts/list-by-type-with-project'

import { Button } from '@/components/ui/button'
import { ErrorAlert } from '@/components/ui/error-alert'

import { LabLayout } from '@/components/lab-layout'

import { FractalDataTable } from './components/data-table'

export const dynamic = 'force-dynamic'

export default async function Fractal() {
  const { contexts, error } = await listContextsByTypeWithProjectsAction({ type: 'fractals' })
  return (
    <LabLayout
      title="Fractal"
      pageTitle="Fractal"
      icon="pyramid"
      breadcrumb={[{ href: '/fractal', label: 'Fractal' }]}
      backTo={{ href: '/dashboard', label: 'Dashboard' }}
      actions={
        <Link href="/fractal/new">
          <Button size="sm">
            <PlusIcon className="h-4 w-4" />
            New Fractal
          </Button>
        </Link>
      }
    >
      {error ? <ErrorAlert error={error} /> : <FractalDataTable data={contexts || []} />}
    </LabLayout>
  )
}
