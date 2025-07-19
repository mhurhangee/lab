'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/dropzone'

import { updateFileAction } from '@/app/actions/files/update'

import { toast } from 'sonner'

interface FileRecord {
  id: string
  name: string
  type: string
  size: number
  url: string
  createdAt: Date
  updatedAt: Date
}

interface EditFormProps {
  file: FileRecord
}

export function EditForm({ file }: EditFormProps) {
  const router = useRouter()
  const [name, setName] = useState(file.name)
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdate = async () => {
    if (!name.trim()) {
      toast.error('Please enter a file name')
      return
    }

    setIsUpdating(true)

    try {
      const result = await updateFileAction({
        id: file.id,
        name: name.trim(),
        file: newFiles.length > 0 ? newFiles[0] : undefined,
      })

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success('File updated successfully!')
      router.push(`/files/${file.id}`)
    } catch (error) {
      toast.error('Failed to update file')
    } finally {
      setIsUpdating(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">File Details</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">File Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter file name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Current Type:</span> {file.type}
            </div>
            <div>
              <span className="text-muted-foreground">Current Size:</span> {formatFileSize(file.size)}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Replace File (Optional)</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Upload a new file to replace the current one. Leave empty to keep the current file.
        </p>
        <Dropzone
          src={newFiles}
          onDrop={(acceptedFiles) => setNewFiles(acceptedFiles)}
          maxFiles={1}
          maxSize={50 * 1024 * 1024} // 50MB
          className="min-h-[150px]"
        >
          <DropzoneContent />
          <DropzoneEmptyState>
            <div className="flex flex-col items-center justify-center text-center">
              <div className="bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-md mb-3">
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
              <p className="text-sm text-muted-foreground">
                Drag and drop a new file here, or click to browse
              </p>
            </div>
          </DropzoneEmptyState>
        </Dropzone>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => router.push(`/files/${file.id}`)}
          disabled={isUpdating}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpdate}
          disabled={isUpdating}
        >
          {isUpdating ? 'Updating...' : 'Update File'}
        </Button>
      </div>
    </div>
  )
}
