import { LabLayout } from '@/components/lab-layout'

import { UploadForm } from '../components/upload-form'

export default async function NewPdfPage() {
  return (
    <LabLayout
      title="Upload PDF"
      pageTitle="Upload PDF"
      icon="file-plus"
      description="Select a PDF to upload."
      backTo={{ href: '/pdfs', label: 'PDFs' }}
      breadcrumb={[{ href: '/pdfs', label: 'PDFs' }]}
    >
      <UploadForm />
    </LabLayout>
  )
}
