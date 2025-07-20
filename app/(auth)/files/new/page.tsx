import { LabLayout } from '@/components/lab-layout'

import { FileIcon } from 'lucide-react'

import { listProjectsAction } from '@/app/actions/projects/list'

import { UploadForm } from '../components/upload-form'

import { ErrorAlert } from '@/components/ui/error-alert'

export default async function NewFilePage() {
  const { projects = [], error } = await listProjectsAction()
  return (
    <LabLayout title="Upload File" icon={<FileIcon />} description="Upload a new file">
      <div className="max-w-2xl py-8">
        <h1 className="page-title">Upload File</h1>
        <p className="page-subtitle">
          Select a file to upload. Supported formats include images, documents, and more.
        </p>
      </div>
      <div className="space-y-8 py-8">
        {error ? <ErrorAlert error={error} /> : <UploadForm projects={projects} />}
      </div>
    </LabLayout>
  )
}
