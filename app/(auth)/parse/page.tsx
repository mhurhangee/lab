'use client'

import { Suspense, useEffect, useState } from 'react'

import { useSearchParams } from 'next/navigation'

import { AlertCircle, CheckCircle, ChevronDownIcon } from 'lucide-react'

import { listContextsAction } from '@/app/actions/contexts/list'
import { getParseStatusAction, parseContextAction } from '@/app/actions/contexts/parse'
import { updateContextAction } from '@/app/actions/contexts/update'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader } from '@/components/ui/loader'
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

import { LabLayout } from '@/components/lab-layout'

import { handleErrorClient } from '@/lib/error/client'

import { ContextDB } from '@/types/database'

import { toast } from 'sonner'

function ParsePageContent() {
  const searchParams = useSearchParams()
  const preselectedContextId = searchParams.get('id')

  const [contexts, setContexts] = useState<ContextDB[]>([])
  const [selectedContextId, setSelectedContextId] = useState<string>(preselectedContextId || '')
  const [isLoading, setIsLoading] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [error, setError] = useState('')
  const [parsedContent, setParsedContent] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

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

  const handleEditParse = async () => {
    if (!selectedContextId) {
      setError('Please select a file')
      return
    }

    setIsUpdating(true)
    setError('')

    try {
      const result = await updateContextAction({ id: selectedContextId, markdown: parsedContent })
      if (result.error) {
        setError(result.error)
      }
      if (result.success) {
        toast.success('Parse updated successfully')
      }
    } catch (error) {
      setError(handleErrorClient('An unexpected error occurred', error))
    } finally {
      setIsUpdating(false)
    }
  }

  const selectedContext = contexts.find(context => context.id === selectedContextId)

  const renderSaveButton = () => {
    if (!selectedContextId) {
      return null
    }

    return (
      <Button onClick={handleEditParse} disabled={isUpdating}>
        {isUpdating ? (
          <>
            <Loader />
            Updating...
          </>
        ) : (
          'Save Edit'
        )}
      </Button>
    )
  }

  return (
    <LabLayout
      title="Parse PDF to Markdown"
      description="Use's Llama Cloud to parse the content of a PDF file into markdown. For larger and longer PDFs, this can take a minute or two."
      icon="file-text"
      breadcrumb={[
        { href: '/pdfs', label: 'PDFs' },
        { href: '/parse', label: 'Parse' },
      ]}
      backTo={{ href: '/pdfs', label: 'PDFs' }}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChevronDownIcon />
              Select File
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader />
                <span>Loading files...</span>
              </div>
            ) : (
              <>
                <div className="space-y-2">
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
                  >
                    {isParsing ? (
                      <>
                        <Loader />
                        Parsing...
                      </>
                    ) : (
                      'Parse File'
                    )}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {parsedContent && (
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <CardTitle>Parsed Content</CardTitle>
                {renderSaveButton()}
              </div>
              <CardDescription>The markdown content extracted from your file.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="source">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="source">Source</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="preview">
                  <Markdown>{parsedContent}</Markdown>
                </TabsContent>
                <TabsContent value="source">
                  <Textarea
                    value={parsedContent}
                    className="min-h-[400px] font-mono text-sm"
                    placeholder="Parsed markdown content will appear here..."
                    onChange={e => setParsedContent(e.target.value)}
                  />
                  <div className="mt-4 flex justify-end">{renderSaveButton()}</div>
                </TabsContent>
              </Tabs>
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
