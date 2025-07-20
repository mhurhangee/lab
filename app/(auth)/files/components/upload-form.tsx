'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/dropzone'

import { ProjectSelector } from '@/components/project-selector'

import { handleErrorClient } from '@/lib/error/client'

import type { ProjectDB } from '@/types/database'

import { toast } from 'sonner'

import { createFileAction } from '@/app/actions/files/create'

interface UploadFormProps {
  projects: ProjectDB[]
}

export function UploadForm({ projects }: UploadFormProps) {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async () => {
    if (!files.length) {
      toast.error('Please select a file to upload')
      return
    }

    setIsUploading(true)

    try {
      const file = files[0]
      const result = await createFileAction({
        file,
        projectId: selectedProjectId || undefined,
      })

      if (result.error) {
        handleErrorClient('Failed to upload file', result.error)
        return
      }

      toast.success('File uploaded successfully!')
      router.push(`/files/${result.id}`)
    } catch (error) {
      handleErrorClient('Failed to upload file', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-semibold">Project</h2>
        <ProjectSelector
          projects={projects}
          selectedProjectId={selectedProjectId}
          onProjectSelect={setSelectedProjectId}
          placeholder="Select a project (optional)"
          className="mb-6"
        />
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-semibold">Select File</h2>
        <Dropzone
          src={files}
          onDrop={acceptedFiles => setFiles(acceptedFiles)}
          maxFiles={1}
          maxSize={50 * 1024 * 1024} // 50MB
          className="min-h-[200px]"
        >
          <DropzoneContent />
          <DropzoneEmptyState>
            <div className="flex flex-col items-center justify-center text-center">
              <div className="bg-muted text-muted-foreground mb-4 flex size-12 items-center justify-center rounded-md">
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
              <h3 className="mb-2 text-lg font-semibold">Upload a file</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Drag and drop your file here, or click to browse
              </p>
              <p className="text-muted-foreground text-xs">Maximum file size: 50MB</p>
            </div>
          </DropzoneEmptyState>
        </Dropzone>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.push('/files')} disabled={isUploading}>
          Cancel
        </Button>
        <Button onClick={() => void handleUpload()} disabled={!files.length || isUploading}>
          {isUploading ? 'Uploading...' : 'Upload File'}
        </Button>
      </div>
    </div>
  )
}
