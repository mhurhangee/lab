import { notFound } from 'next/navigation'

import { getContextsAction } from '@/app/actions/contexts/get'
import { listProjectsAction } from '@/app/actions/projects/list'

import { ErrorAlert } from '@/components/ui/error-alert'

import { LabLayout } from '@/components/lab-layout'

import { EditForm } from '../../components/edit-form'

interface EditFilePageProps {
  params: Promise<{ id: string }>
}

export default async function EditFilePage({ params }: EditFilePageProps) {
  const { id } = await params
  const [{ context, error }, { projects = [] }] = await Promise.all([
    getContextsAction({ id }),
    listProjectsAction(),
  ])

  if (error) {
    return (
      <LabLayout
        pageTitle="Edit PDF"
        title="Edit PDF"
        icon="file"
        breadcrumb={[{ href: '/pdfs', label: 'PDFs' }]}
      >
        <ErrorAlert error={error} />
      </LabLayout>
    )
  }

  if (!context) {
    notFound()
  }

  return (
    <LabLayout
      pageTitle={`Edit ${context.name}`}
      title={`Edit ${context.name}`}
      icon="file"
      backTo={{ href: `/pdfs/${context.id}`, label: context.name }}
      breadcrumb={[
        { href: '/pdfs', label: 'PDFs' },
        { href: `/pdfs/${context.id}`, label: context.name },
        { href: `/pdfs/${context.id}/edit`, label: 'Edit' },
      ]}
      description="Update the file name or replace the file with a new version."
    >
      <EditForm file={context} projects={projects} />
    </LabLayout>
  )
}
