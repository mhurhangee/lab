import Link from 'next/link'

import { PlusIcon } from 'lucide-react'

import { listContextsByTypeWithProjectsAction } from '@/app/actions/contexts/list-by-type-with-project'

import { Button } from '@/components/ui/button'
import { ErrorAlert } from '@/components/ui/error-alert'

import { LabLayout } from '@/components/lab-layout'

import { TextEditorDataTable } from './components/data-table'

export default async function TextEditorPage() {
  const { contexts, error } = await listContextsByTypeWithProjectsAction({ type: 'docs' })

  return (
    <LabLayout
      title="Text Editor"
      pageTitle="Text Editor"
      icon="type-outline"
      breadcrumb={[{ href: '/docs', label: 'Text Editor' }]}
      backTo={{ href: '/dashboard', label: 'Dashboard' }}
      actions={
        <Link href="/docs/new">
          <Button size="sm">
            <PlusIcon className="h-4 w-4" />
            New Document
          </Button>
        </Link>
      }
    >
      {error ? <ErrorAlert error={error} /> : <TextEditorDataTable data={contexts || []} />}
    </LabLayout>
  )
}
