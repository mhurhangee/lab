'use client'

import { Suspense, useEffect, useState } from 'react'

import Link from 'next/link'

import { BookOpenIcon, FolderIcon, SearchIcon } from 'lucide-react'

import { searchKnowledgeBaseAction } from '@/app/actions/knowledge-base/search'
import { listProjectsAction } from '@/app/actions/projects/list'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ErrorAlert } from '@/components/ui/error-alert'
import { Input } from '@/components/ui/input'
import { Loader } from '@/components/ui/loader'
import { Markdown } from '@/components/ui/markdown'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { LabLayout } from '@/components/lab-layout'

import { handleErrorClient } from '@/lib/error/client'

import { ProjectDB } from '@/types/database'

import { toast } from 'sonner'

interface SearchResult {
  id?: string
  content: string
  score?: number
  metadata?: {
    filename?: string
    source?: string
  }
}

function KnowledgeBaseContent() {
  const [projects, setProjects] = useState<ProjectDB[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')

  // Load projects on component mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true)
        const { projects: projectsData, error: projectsError } = await listProjectsAction()

        if (projectsError) {
          setError(projectsError)
          return
        }

        // Filter projects that have vector stores
        const projectsWithVectorStores = projectsData?.filter(p => p.vectorStoreId) || []
        setProjects(projectsWithVectorStores)

        if (projectsWithVectorStores.length > 0) {
          setSelectedProjectId(projectsWithVectorStores[0].id)
        }
      } catch (err) {
        handleErrorClient('Failed to load projects', err, 'KnowledgeBase')
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [])

  const handleSearch = async () => {
    if (!selectedProjectId || !searchQuery.trim()) {
      toast.error('Please select a project and enter a search query')
      return
    }

    const selectedProject = projects.find(p => p.id === selectedProjectId)
    if (!selectedProject?.vectorStoreId) {
      toast.error('Selected project does not have a knowledge base')
      return
    }

    try {
      setIsSearching(true)
      setError('')

      const result = await searchKnowledgeBaseAction({
        projectId: selectedProjectId,
        query: searchQuery,
        rewriteQuery: false,
        maxResults: 10,
      })

      if (!result.success) {
        setError(result.error || 'Search failed')
        return
      }

      setSearchResults(result.results || [])

      if (result.results?.length === 0) {
        toast.info('No results found for your query')
      }
    } catch (err) {
      handleErrorClient('Search failed', err, 'KnowledgeBase')
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader />
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpenIcon className="h-5 w-5" />
            No Knowledge Bases Available
          </CardTitle>
          <CardDescription>
            You need to create projects with contexts (PDFs or URLs) to use the knowledge base
            search.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4 text-sm">
            Knowledge bases are automatically created when you add contexts to projects. Each
            project becomes a searchable knowledge base containing all its associated files and
            URLs.
          </p>
          <Button asChild>
            <Link href="/projects/new">Create Your First Project</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SearchIcon className="h-5 w-5" />
            Search Knowledge Base
          </CardTitle>
          <CardDescription>
            Search across all documents in your selected project using AI-powered semantic search.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Project Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Project</label>
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a project to search" />
              </SelectTrigger>
              <SelectContent>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    <div className="flex items-center gap-2">
                      <FolderIcon className="h-4 w-4" />
                      {project.title}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Search Query</label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter your search query..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                onClick={handleSearch}
                disabled={isSearching || !selectedProjectId || !searchQuery.trim()}
              >
                {isSearching ? <Loader /> : <SearchIcon className="h-4 w-4" />}
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && <ErrorAlert error={error} />}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>
              Found {searchResults.length} relevant results for &quot;{searchQuery}&quot;
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchResults.map((result, index) => (
                <div key={result.id || index} className="space-y-2 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {result.metadata?.filename || `Result ${index + 1}`}
                      </span>
                      {result.score && (
                        <span className="bg-muted rounded px-2 py-1 text-xs">
                          Score: {(result.score * 100).toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <Markdown>{result.content}</Markdown>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use Knowledge Base Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <p>
              <strong>1. Select a Project:</strong> Choose the project whose knowledge base you want
              to search.
            </p>
            <p>
              <strong>2. Enter Query:</strong> Type your search query. Use natural language - the AI
              will understand context and meaning.
            </p>
            <p>
              <strong>3. Review Results:</strong> Results are ranked by relevance and include
              content snippets from your documents.
            </p>
          </div>
          <div className="bg-muted mt-4 rounded-lg p-3">
            <p className="text-muted-foreground text-sm">
              <strong>Tip:</strong> Knowledge bases are automatically created when you add PDFs or
              URLs to projects. The more context you add, the more comprehensive your searches will
              be.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function KnowledgeBasePage() {
  return (
    <LabLayout
      title="Knowledge Base"
      icon="book-open"
      breadcrumb={[{ href: '/knowledge-base', label: 'Knowledge Base' }]}
      backTo={{ href: '/dashboard', label: 'Dashboard' }}
      description="Search across all your project documents using AI-powered semantic search."
    >
      <Suspense fallback={<Loader />}>
        <KnowledgeBaseContent />
      </Suspense>
    </LabLayout>
  )
}
