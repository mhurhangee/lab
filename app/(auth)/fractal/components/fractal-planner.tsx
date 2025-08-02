'use client'

import type React from 'react'
import { useState } from 'react'

import { Download, Edit3, Eye, Save, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { handleErrorClient } from '@/lib/error/client'

import { ContextDB } from '@/types/database'

import { toast } from 'sonner'

import {
  type FractalProject,
  PROJECT_TEMPLATES,
  exportToMarkdown,
  serializeProject,
} from '../lib/fractal-structure'
import { ErrorBoundary } from './error-boundary'
import { FractalOutline } from './fractal-outline'
import { FractalOverview } from './fractal-overview'
import { ProjectTemplates } from './project-templates'

interface FractalPlannerProps {
  savedFractal: ContextDB
}

export function FractalPlanner({ savedFractal }: FractalPlannerProps) {
  const [project, setProject] = useState<FractalProject>(
    savedFractal.textDocument as FractalProject
  )
  const [activeTab, setActiveTab] = useState('templates')
  const [isLoading, setIsLoading] = useState(false)

  const updateProject = (updatedProject: FractalProject) => {
    setProject(updatedProject)
  }

  const loadTemplate = (templateName: keyof typeof PROJECT_TEMPLATES) => {
    try {
      setIsLoading(true)
      const newProject = PROJECT_TEMPLATES[templateName]()
      setProject(newProject)
      setActiveTab('outline')

      toast.success(`${templateName} template has been loaded successfully.`)
    } catch (error) {
      handleErrorClient('Failed to load the selected template. Please try again.', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      const serialized = serializeProject(project)
      const blob = new Blob([serialized], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${project.title || 'untitled-project'}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('Your project has been saved as a JSON file.')
    } catch (error) {
      handleErrorClient('Failed to save the project. Please try again.', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportMarkdown = async () => {
    try {
      setIsLoading(true)
      const markdown = exportToMarkdown(project)
      const blob = new Blob([markdown], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${project.title || 'untitled-project'}.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('Your project outline has been exported as a Markdown file.')
    } catch (error) {
      handleErrorClient('Failed to export the project. Please try again.', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ErrorBoundary>
      <div className="mx-auto">
        {/* File Controls */}
        <div className="mb-2 flex justify-end gap-2">
          <Button
            onClick={handleSave}
            variant="ghost"
            size="icon"
            className="flex items-center gap-2 bg-transparent"
            disabled={isLoading}
          >
            <Save className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleExportMarkdown}
            variant="ghost"
            size="icon"
            className="flex items-center gap-2 bg-transparent"
            disabled={isLoading}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="outline" className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Overview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates">
            <ProjectTemplates onSelectTemplate={loadTemplate} />
          </TabsContent>

          <TabsContent value="outline">
            <ErrorBoundary>
              <FractalOutline project={project} onUpdate={updateProject} />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="overview">
            <ErrorBoundary>
              <FractalOverview project={project} />
            </ErrorBoundary>
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  )
}
