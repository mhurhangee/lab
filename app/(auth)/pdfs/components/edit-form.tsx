'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { updateContextAction } from '@/app/actions/contexts/update'

import { Button } from '@/components/ui/button'
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/dropzone'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { ProjectSelector } from '@/components/project-selector'

import { handleErrorClient } from '@/lib/error/client'
import { formatFileSize } from '@/lib/file-size'

import type { ContextDB, ProjectDB } from '@/types/database'

import { toast } from 'sonner'

interface EditFormProps {
  file: ContextDB
  projects: ProjectDB[]
}

export function EditForm({ file, projects }: EditFormProps) {
  const router = useRouter()
  const [name, setName] = useState(file.name)
  const [localProjectId, setLocalProjectId] = useState<string | null>(file.projectId || null)
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdate = async () => {
    if (!name.trim()) {
      handleErrorClient('Please enter a file name', 'Please enter a file name')
      return
    }

    setIsUpdating(true)

    try {
      const result = await updateContextAction({
        id: file.id,
        name: name.trim(),
        file: newFiles.length > 0 ? newFiles[0] : undefined,
        projectId: localProjectId,
      })

      if (result.error) {
        handleErrorClient('Failed to update file', result.error, 'Unexpected error in EditForm')
        return
      }

      toast.success('PDF updated successfully!')
      router.push(`/pdfs/${file.id}`)
    } catch (error) {
      handleErrorClient('Failed to update file', error, 'Unexpected error in EditForm')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-semibold">Project</h2>
        <div className="space-y-2">
          <Label htmlFor="project">Project (Optional)</Label>
          <p className="text-muted-foreground text-sm">Select which project this PDF belongs to.</p>
          <ProjectSelector
            placeholder="Select a project (optional)"
            className="w-full"
            variant="outline"
            controlled={true}
            value={localProjectId}
            onValueChange={setLocalProjectId}
          />
        </div>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-semibold">File Details</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">File Name</Label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter file name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Current Type:</span> {file.type}
            </div>
            <div>
              <span className="text-muted-foreground">Current Size:</span>{' '}
              {formatFileSize(file.size)}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-semibold">Replace File (Optional)</h2>
        <p className="text-muted-foreground mb-4 text-sm">
          Upload a new file to replace the current one. Leave empty to keep the current file.
        </p>
        <Dropzone
          src={newFiles}
          onDrop={acceptedFiles => setNewFiles(acceptedFiles)}
          maxFiles={1}
          maxSize={50 * 1024 * 1024} // 50MB
          className="min-h-[150px]"
        >
          <DropzoneContent />
          <DropzoneEmptyState>
            <div className="flex flex-col items-center justify-center text-center">
              <div className="bg-muted text-muted-foreground mb-3 flex size-10 items-center justify-center rounded-md">
                <svg
                  className="h-5 w-5"
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
              <p className="text-muted-foreground text-sm">
                Drag and drop a new file here, or click to browse
              </p>
            </div>
          </DropzoneEmptyState>
        </Dropzone>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => router.push(`/pdfs/${file.id}`)}
          disabled={isUpdating}
        >
          Cancel
        </Button>
        <Button onClick={() => void handleUpdate()} disabled={isUpdating}>
          {isUpdating ? 'Updating...' : 'Update PDF'}
        </Button>
      </div>
    </div>
  )
}
