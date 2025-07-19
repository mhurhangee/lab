import { notFound } from 'next/navigation'

import { ErrorAlert } from '@/components/ui/error-alert'

import { LabLayout } from '@/components/lab-layout'

import { FileIcon } from 'lucide-react'

import { getFileAction } from '@/app/actions/files/get'

import { EditForm } from '../../components/edit-form'

interface EditFilePageProps {
  params: Promise<{ id: string }>
}

export default async function EditFilePage({ params }: EditFilePageProps) {
  const { id } = await params
  const { file, error } = await getFileAction({ id })

  if (error) {
    return (
      <LabLayout title="Edit File" icon={<FileIcon />}>
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
      icon={<FileIcon />}
      description="Update file details or replace file"
    >
      <div className="max-w-2xl py-8">
        <h1 className="page-title">Edit File</h1>
        <p className="page-subtitle">
          Update the file name or replace the file with a new version.
        </p>
      </div>
      <div className="space-y-8 py-8">
        <EditForm file={file} />
      </div>
    </LabLayout>
  )
}
