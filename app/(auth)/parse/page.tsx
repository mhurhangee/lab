'use client'

import { Suspense, useEffect, useState } from 'react'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { AlertCircle, CheckCircle, FileText, Loader2 } from 'lucide-react'

import { listContextsAction } from '@/app/actions/contexts/list'
import { getParseStatusAction, parseContextAction } from '@/app/actions/contexts/parse'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

import { LabLayout } from '@/components/lab-layout'

import { handleErrorClient } from '@/lib/error/client'

import { ContextDB } from '@/types/database'

function ParsePageContent() {
  const searchParams = useSearchParams()
  const preselectedContextId = searchParams.get('id')

  const [contexts, setContexts] = useState<ContextDB[]>([])
  const [selectedContextId, setSelectedContextId] = useState<string>(preselectedContextId || '')
  const [isLoading, setIsLoading] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [error, setError] = useState('')
  const [parsedContent, setParsedContent] = useState('')

  // Load files on component mount
  useEffect(() => {
    const loadContexts = async () => {
      setIsLoading(true)
      try {
        const result = await listContextsAction()
        if (result.error) {
          setError(result.error)
        } else if (result.results) {
          setContexts(result.results)
        }
      } catch (error) {
        setError(handleErrorClient('Failed to load contexts', error))
      } finally {
        setIsLoading(false)
      }
    }

    void loadContexts()
  }, [])

  // Load existing parsed content if file is already parsed
  useEffect(() => {
    if (selectedContextId) {
      const loadParseStatus = async () => {
        const result = await getParseStatusAction({ contextId: selectedContextId })
        if (result.success && result.isParsed && result.markdown) {
          setParsedContent(result.markdown)
        } else {
          setParsedContent('')
        }
      }
      void loadParseStatus()
    }
  }, [selectedContextId])

  const handleParse = async () => {
    if (!selectedContextId) {
      setError('Please select a file')
      return
    }

    setIsParsing(true)
    setError('')
    setParsedContent('')

    try {
      const result = await parseContextAction({ contextId: selectedContextId })

      if (result.error) {
        setError(result.error)
      } else if (result.success) {
        setParsedContent(result.markdown || '')

        // Update the files list to reflect the new parse status
        setContexts(prev =>
          prev.map(context =>
            context.id === selectedContextId ? { ...context, isParsed: true } : context
          )
        )
      }
    } catch (error) {
      setError('An unexpected error occurred')
      console.error(error)
    } finally {
      setIsParsing(false)
    }
  }

  const selectedContext = contexts.find(context => context.id === selectedContextId)

  return (
    <LabLayout
      title="Parse Files"
      description="Select a file to parse the content into markdown."
      icon="file-text"
      breadcrumb={[
        { href: '/files', label: 'Files' },
        { href: '/parse', label: 'Parse' },
      ]}
      backTo={{ href: '/pdfs', label: 'Dashboard' }}
    >
      <div className="space-y-6">
        <Card className="w-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Parse File with Llama Cloud
            </CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading files...</span>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="file-select">Select File</Label>
                  <Select value={selectedContextId} onValueChange={setSelectedContextId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a file to parse" />
                    </SelectTrigger>
                    <SelectContent>
                      {contexts.map(context => (
                        <SelectItem key={context.id} value={context.id}>
                          <div className="flex w-full items-center justify-between">
                            <span>{context.name}</span>
                            {context.parsedMarkdown && (
                              <Badge variant="secondary" className="ml-2">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Parsed
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedContext?.parsedMarkdown && (
                    <p className="text-muted-foreground text-sm">
                      This file has already been parsed. Parsing again will overwrite the existing
                      content.
                    </p>
                  )}
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => void handleParse()}
                    disabled={!selectedContextId || isParsing}
                    className="flex-1"
                  >
                    {isParsing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Parsing...
                      </>
                    ) : (
                      'Parse File'
                    )}
                  </Button>
                  {selectedContextId && (
                    <Button variant="outline" asChild>
                      <Link href={`/contexts/${selectedContextId}`}>View Context</Link>
                    </Button>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {parsedContent && (
          <Card>
            <CardHeader>
              <CardTitle>Parsed Content</CardTitle>
              <CardDescription>The markdown content extracted from your file.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={parsedContent}
                readOnly
                className="min-h-[400px] font-mono text-sm"
                placeholder="Parsed markdown content will appear here..."
              />
            </CardContent>
          </Card>
        )}
      </div>
    </LabLayout>
  )
}

export default function ParsePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ParsePageContent />
    </Suspense>
  )
}
