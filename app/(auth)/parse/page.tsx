'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

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

import { AlertCircle, CheckCircle, FileText, Loader2 } from 'lucide-react'

import { listFilesAction } from '@/app/actions/files/list'
import { getParseStatusAction, parseFileAction } from '@/app/actions/files/parse'

interface FileOption {
  id: string
  name: string
  isParsed: boolean
}

export default function ParsePage() {
  const searchParams = useSearchParams()
  const preselectedFileId = searchParams.get('fileId')

  const [files, setFiles] = useState<FileOption[]>([])
  const [selectedFileId, setSelectedFileId] = useState<string>(preselectedFileId || '')
  const [isLoading, setIsLoading] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [error, setError] = useState('')
  const [parsedContent, setParsedContent] = useState('')

  // Load files on component mount
  useEffect(() => {
    const loadFiles = async () => {
      setIsLoading(true)
      try {
        const result = await listFilesAction()
        if (result.error) {
          setError(result.error)
        } else if (result.files) {
          // Check parse status for each file
          const filesWithStatus = await Promise.all(
            result.files.map(async file => {
              const statusResult = await getParseStatusAction({ fileId: file.id })
              return {
                id: file.id,
                name: file.name,
                isParsed: statusResult.success ? statusResult.isParsed : false,
              }
            })
          )
          setFiles(filesWithStatus)
        }
      } catch {
        setError('Failed to load files')
      } finally {
        setIsLoading(false)
      }
    }

    void loadFiles()
  }, [])

  // Load existing parsed content if file is already parsed
  useEffect(() => {
    if (selectedFileId) {
      const loadParseStatus = async () => {
        const result = await getParseStatusAction({ fileId: selectedFileId })
        if (result.success && result.isParsed && result.markdown) {
          setParsedContent(result.markdown)
        } else {
          setParsedContent('')
        }
      }
      void loadParseStatus()
    }
  }, [selectedFileId])

  const handleParse = async () => {
    if (!selectedFileId) {
      setError('Please select a file')
      return
    }

    setIsParsing(true)
    setError('')
    setParsedContent('')

    try {
      const result = await parseFileAction({ fileId: selectedFileId })

      if (result.error) {
        setError(result.error)
      } else if (result.success) {
        setParsedContent(result.markdown || '')

        // Update the files list to reflect the new parse status
        setFiles(prev =>
          prev.map(file => (file.id === selectedFileId ? { ...file, isParsed: true } : file))
        )
      }
    } catch (error) {
      setError('An unexpected error occurred')
      console.error(error)
    } finally {
      setIsParsing(false)
    }
  }

  const selectedFile = files.find(f => f.id === selectedFileId)

  return (
    <LabLayout
      title="Parse Files"
      description="Select a file to parse the content into markdown."
      icon="file-text"
      breadcrumb={[
        { href: '/files', label: 'Files' },
        { href: '/parse', label: 'Parse' },
      ]}
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
                  <Select value={selectedFileId} onValueChange={setSelectedFileId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a file to parse" />
                    </SelectTrigger>
                    <SelectContent>
                      {files.map(file => (
                        <SelectItem key={file.id} value={file.id}>
                          <div className="flex w-full items-center justify-between">
                            <span>{file.name}</span>
                            {file.isParsed && (
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
                  {selectedFile?.isParsed && (
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
                    disabled={!selectedFileId || isParsing}
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
                  {selectedFileId && (
                    <Button variant="outline" asChild>
                      <Link href={`/files/${selectedFileId}`}>View File</Link>
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
