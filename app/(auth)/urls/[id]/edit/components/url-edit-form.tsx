'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ErrorAlert } from '@/components/ui/error-alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Markdown } from '@/components/ui/markdown'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

import { ExternalLinkIcon, SaveIcon } from 'lucide-react'

import { updateUrlAction } from '@/app/actions/urls/update'
import { handleErrorClient } from '@/lib/error/client'
import { formatDate } from '@/lib/date'
import { formatFileSize } from '@/lib/file-size'

type UrlWithProject = {
  id: string
  name: string
  url: string
  size: number
  type: string
  projectId: string | null
  parsedMarkdown: string | null
  createdAt: Date
  updatedAt: Date
  projectTitle: string | null
}

interface UrlEditFormProps {
  url: UrlWithProject
  projects: Array<{ id: string; title: string }>
}

export function UrlEditForm({ url, projects }: UrlEditFormProps) {
  const router = useRouter()
  const [name, setName] = useState(url.name)
  const [projectId, setProjectId] = useState(url.projectId || 'none')
  const [parsedMarkdown, setParsedMarkdown] = useState(url.parsedMarkdown || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await updateUrlAction(url.id, {
        name,
        projectId: projectId === 'none' ? null : projectId,
        parsedMarkdown,
      })

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push(`/urls/${url.id}`)
        }, 1000)
      }
    } catch (err) {
      handleErrorClient('Failed to update URL', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            URL Details
            <a
              href={url.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <ExternalLinkIcon className="h-4 w-4" />
            </a>
          </CardTitle>
          <CardDescription>
            Edit the title, project assignment, and content of this scraped URL.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-muted-foreground">Original URL</Label>
              <p className="break-all">{url.url}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Size</Label>
              <p>{formatFileSize(url.size)}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Created</Label>
              <p>{formatDate(url.createdAt)}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Updated</Label>
              <p>{formatDate(url.updatedAt)}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Title</Label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project">Project</Label>
            <Select value={projectId} onValueChange={setProjectId} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No project</SelectItem>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && <ErrorAlert error={error} />}

          {success && (
            <div className="rounded-md border border-green-200 bg-green-50 p-3">
              <p className="text-sm text-green-800">URL updated successfully! Redirecting...</p>
            </div>
          )}

          <Button onClick={handleSave} disabled={isLoading}>
            <SaveIcon className="mr-2 h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
          <CardDescription>
            The extracted markdown content from the URL. You can edit this content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="edit">
            <TabsList>
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="edit">
              <Textarea
                value={parsedMarkdown}
                onChange={e => setParsedMarkdown(e.target.value)}
                disabled={isLoading}
                rows={20}
                className="font-mono text-sm"
                placeholder="No content extracted"
              />
            </TabsContent>
            <TabsContent value="preview">
              <div className="prose prose-sm max-w-none dark:prose-invert min-h-[500px] border rounded-md p-4">
                <Markdown>{parsedMarkdown || 'No content to preview'}</Markdown>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
