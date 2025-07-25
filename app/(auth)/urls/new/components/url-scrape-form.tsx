'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

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

import { LoaderIcon } from 'lucide-react'

import { scrapeUrlWithExaAction } from '@/app/actions/urls/scrape-with-exa'

interface UrlScrapeFormProps {
  projects: Array<{ id: string; title: string }>
}

export function UrlScrapeForm({ projects }: UrlScrapeFormProps) {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [extractionMethod, setExtractionMethod] = useState('exa')
  const [projectId, setProjectId] = useState<string>('none')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scrapedContent, setScrapedContent] = useState<{
    title: string
    content: string
    url: string
  } | null>(null)

  const handleScrape = async () => {
    if (!url.trim()) {
      setError('Please enter a URL')
      return
    }

    setIsLoading(true)
    setError(null)
    setScrapedContent(null)

    try {
      const result = await scrapeUrlWithExaAction(url, projectId === 'none' ? undefined : projectId)

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
      setError('Failed to scrape URL')
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
