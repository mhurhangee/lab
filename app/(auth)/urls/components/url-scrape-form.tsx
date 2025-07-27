'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { LoaderIcon } from 'lucide-react'

import { scrapeUrlWithExaAction } from '@/app/actions/urls/scrape-with-exa'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ErrorAlert } from '@/components/ui/error-alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

import { ProjectSelector } from '@/components/project-selector'

import { handleErrorClient } from '@/lib/error/client'

import { useProject } from '@/providers/project'

export function UrlScrapeForm() {
  const router = useRouter()
  const { selectedProject } = useProject()
  const [url, setUrl] = useState('')
  const [extractionMethod, setExtractionMethod] = useState('exa')
  const [localProjectId, setLocalProjectId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scrapedContent, setScrapedContent] = useState<{
    title: string
    content: string
    url: string
  } | null>(null)

  // Pre-select the current project when component mounts
  useEffect(() => {
    if (selectedProject) {
      setLocalProjectId(selectedProject.id)
    }
  }, [selectedProject])

  const handleScrape = async () => {
    if (!url.trim()) {
      setError('Please enter a URL')
      return
    }

    setIsLoading(true)
    setError(null)
    setScrapedContent(null)

    try {
      const result = await scrapeUrlWithExaAction(url, localProjectId || undefined)

      if (result.error) {
        setError(result.error)
      } else if (result.file) {
        setScrapedContent({
          title: result.file.name,
          content: result.file.content || '',
          url: result.file.url,
        })
      }
    } catch (err) {
      setError(handleErrorClient('Failed to scrape URL', err))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = () => {
    // Content is already saved in the scrape action
    router.push('/urls')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Scrape URL</CardTitle>
          <CardDescription>
            Enter a URL to extract its content using various extraction methods.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={e => setUrl(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="extraction-method">Extraction Method</Label>
            <Select
              value={extractionMethod}
              onValueChange={setExtractionMethod}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select extraction method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exa">Exa (Recommended)</SelectItem>
                <SelectItem value="diffbot" disabled>
                  Diffbot (Coming Soon)
                </SelectItem>
                <SelectItem value="tavily" disabled>
                  Tavily (Coming Soon)
                </SelectItem>
                <SelectItem value="playwright" disabled>
                  Playwright (Coming Soon)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project">Project (Optional)</Label>
            <p className="text-muted-foreground text-sm">
              Select which project to add this URL to. Defaults to your currently selected project.
            </p>
            <ProjectSelector
              placeholder="Select a project (optional)"
              className="w-full"
              variant="outline"
              controlled={true}
              value={localProjectId}
              onValueChange={setLocalProjectId}
            />
          </div>

          {error && <ErrorAlert error={error} />}

          <Button onClick={handleScrape} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                Scraping...
              </>
            ) : (
              'Scrape URL'
            )}
          </Button>
        </CardContent>
      </Card>

      {scrapedContent && (
        <Card>
          <CardHeader>
            <CardTitle>Scraped Content</CardTitle>
            <CardDescription>Content has been successfully extracted and saved.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={scrapedContent.title} readOnly />
            </div>

            <div className="space-y-2">
              <Label>URL</Label>
              <Input value={scrapedContent.url} readOnly />
            </div>

            <div className="space-y-2">
              <Label>Content Preview</Label>
              <Textarea
                value={
                  scrapedContent.content.substring(0, 500) +
                  (scrapedContent.content.length > 500 ? '...' : '')
                }
                readOnly
                rows={10}
                className="font-mono text-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1">
                View in URLs
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setUrl('')
                  setScrapedContent(null)
                  setError(null)
                }}
                className="flex-1"
              >
                Scrape Another
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
