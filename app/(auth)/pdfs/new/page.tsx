import { listProjectsAction } from '@/app/actions/projects/list'

import { ErrorAlert } from '@/components/ui/error-alert'

import { LabLayout } from '@/components/lab-layout'

import { UploadForm } from '../components/upload-form'

export default async function NewPdfPage() {
  const { projects = [], error } = await listProjectsAction()
  return (
    <LabLayout
      title="Upload PDF"
      pageTitle="Upload PDF"
      icon="file-plus"
      description="Select a PDF to upload."
      backTo={{ href: '/pdfs', label: 'PDFs' }}
      breadcrumb={[{ href: '/pdfs', label: 'PDFs' }]}
    >
      {error ? <ErrorAlert error={error} /> : <UploadForm projects={projects} />}
    </LabLayout>
  )
}
