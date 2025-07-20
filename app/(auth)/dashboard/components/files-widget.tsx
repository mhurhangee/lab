'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ErrorAlert } from '@/components/ui/error-alert'

import { formatDate } from '@/lib/date'
import { handleErrorClient } from '@/lib/error/client'
import { formatFileSize } from '@/lib/file-size'

import type { FileDB } from '@/types/database'

import { DynamicIcon, type IconName } from 'lucide-react/dynamic'

import { listFilesAction } from '@/app/actions/files/list'

function getFileIcon(type: string): IconName {
  if (type.startsWith('image/')) return 'image'
  if (type.includes('pdf')) return 'file-text'
  if (type.includes('video/')) return 'video'
  if (type.includes('audio/')) return 'music'
  if (type.includes('text/') || type.includes('application/json')) return 'file-text'
  if (type.includes('zip') || type.includes('archive')) return 'archive'
  return 'file'
}

export function FilesWidget() {
  const [files, setFiles] = useState<FileDB[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const result = await listFilesAction()
        if (result.error) {
          setError(result.error)
          handleErrorClient(result.error, 'Failed to load files')
        } else {
          // Show only the 3 most recent files
          setFiles(result.files?.slice(0, 3) || [])
        }
      } catch (err) {
        setError('Failed to load files')
        handleErrorClient('Failed to load files', err)
      } finally {
        setLoading(false)
      }
    }

    void fetchFiles()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <DynamicIcon name="file" className="h-4 w-4" />
            Recent Files
          </CardTitle>
          <Link href="/files">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted mb-2 h-4 w-3/4 rounded" />
                <div className="bg-muted h-3 w-1/2 rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <DynamicIcon name="file" className="h-4 w-4" />
            Recent Files
          </CardTitle>
          <Link href="/files">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <ErrorAlert error={error} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <DynamicIcon name="file" className="h-4 w-4" />
          Recent Files
        </CardTitle>
        <Link href="/files">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {files.length === 0 ? (
          <div className="text-muted-foreground text-sm">
            No files yet. Upload your first file to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {files.map(file => (
              <Link key={file.id} href={`/files/${file.id}`}>
                <div className="group hover:bg-muted/50 cursor-pointer rounded-lg p-2 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <DynamicIcon
                        name={getFileIcon(file.type)}
                        className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="group-hover:text-primary truncate text-sm font-medium">
                          {file.name}
                        </h4>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {formatFileSize(file.size)}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            <DynamicIcon name="clock" className="mr-1 h-3 w-3" />
                            {formatDate(file.updatedAt)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
