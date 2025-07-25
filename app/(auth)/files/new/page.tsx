import { ErrorAlert } from '@/components/ui/error-alert'

import { LabLayout } from '@/components/lab-layout'

import { listProjectsAction } from '@/app/actions/projects/list'

import { UploadForm } from '../components/upload-form'

export default async function NewFilePage() {
  const { projects = [], error } = await listProjectsAction()
  return (
    <LabLayout
      title="Upload File"
      icon="file-plus"
      description="Select a file to upload. Supported formats include images, documents, and more."
      backTo={{ href: '/files', label: 'Files' }}
      breadcrumb={[{ href: '/files', label: 'Files' }]}
    >
      {error ? <ErrorAlert error={error} /> : <UploadForm projects={projects} />}
    </LabLayout>
  )
}
