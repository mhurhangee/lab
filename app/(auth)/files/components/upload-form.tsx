'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/dropzone'

import { createFileAction } from '@/app/actions/files/create'

import { toast } from 'sonner'

export function UploadForm() {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async () => {
    if (!files.length) {
      toast.error('Please select a file to upload')
      return
    }

    setIsUploading(true)

    try {
      const file = files[0]
      const result = await createFileAction({ file })

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success('File uploaded successfully!')
      router.push(`/files/${result.id}`)
    } catch (error) {
      toast.error('Failed to upload file')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Select File</h2>
        <Dropzone
          src={files}
          onDrop={(acceptedFiles) => setFiles(acceptedFiles)}
          maxFiles={1}
          maxSize={50 * 1024 * 1024} // 50MB
          className="min-h-[200px]"
        >
          <DropzoneContent />
          <DropzoneEmptyState>
            <div className="flex flex-col items-center justify-center text-center">
              <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-md mb-4">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Upload a file</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop your file here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Maximum file size: 50MB
              </p>
            </div>
          </DropzoneEmptyState>
        </Dropzone>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => router.push('/files')}
          disabled={isUploading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          disabled={!files.length || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload File'}
        </Button>
      </div>
    </div>
  )
}
