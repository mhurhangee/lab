import { notFound } from 'next/navigation'

import { ErrorAlert } from '@/components/ui/error-alert'

import { LabLayout } from '@/components/lab-layout'

import { getFileAction } from '@/app/actions/files/get'
import { listProjectsAction } from '@/app/actions/projects/list'

import { EditForm } from '../../components/edit-form'

interface EditFilePageProps {
  params: Promise<{ id: string }>
}

export default async function EditFilePage({ params }: EditFilePageProps) {
  const { id } = await params
  const [{ file, error }, { projects = [] }] = await Promise.all([
    getFileAction({ id }),
    listProjectsAction(),
  ])

  if (error) {
    return (
      <LabLayout title="Edit File" icon="file" breadcrumb={[{ href: '/files', label: 'Files' }]}>
        <ErrorAlert error={error} />
      </LabLayout>
    )
  }

  if (!file) {
    notFound()
  }

  return (
    <LabLayout
      title={`Edit ${file.name}`}
      icon="file"
      backToHref={`/files/${file.id}`}
      backToLabel={file.name}
      breadcrumb={[
        { href: '/files', label: 'Files' },
        { href: `/files/${file.id}`, label: file.name },
        { href: `/files/${file.id}/edit`, label: 'Edit' },
      ]}
      description="Update the file name or replace the file with a new version."
    >
      <EditForm file={file} projects={projects} />
    </LabLayout>
  )
}
