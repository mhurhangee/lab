'use client'

import type React from 'react'
import { useState } from 'react'

import { Download, Edit3, Eye, Save, Sparkles } from 'lucide-react'

import { updateContextAction } from '@/app/actions/contexts/update'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { handleErrorClient } from '@/lib/error/client'

import { ContextDB } from '@/types/database'

import { toast } from 'sonner'

import { exportToMarkdown, serializeFractal } from '../lib/fractal-structure'
import { Fractal } from '../lib/types'
import { ErrorBoundary } from './error-boundary'
import { FractalOutline } from './fractal-outline'
import { FractalOverview } from './fractal-overview'
import { PROJECT_TEMPLATES, ProjectTemplates } from './project-templates'

interface FractalPlannerProps {
  savedFractal: ContextDB
}

export function FractalPlanner({ savedFractal }: FractalPlannerProps) {
  const [fractal, setFractal] = useState<Fractal>(savedFractal.textDocument as Fractal)
  const [activeTab, setActiveTab] = useState('templates')
  const [isLoading, setIsLoading] = useState(false)

  const updateFractal = (updatedFractal: Fractal) => {
    setFractal(updatedFractal)
  }

  const loadTemplate = (templateName: keyof typeof PROJECT_TEMPLATES) => {
    try {
      setIsLoading(true)
      const newFractal = PROJECT_TEMPLATES[templateName].create()
      setFractal(newFractal)
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
      const { error } = await updateContextAction({
        id: savedFractal.id,
        name: fractal.title,
        textDocument: serializeFractal(fractal),
      })

      if (error) {
        throw error
      }

      toast.success('Your fractal has been saved to the database.')
    } catch (error) {
      handleErrorClient('Failed to save the fractal. Please try again.', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportMarkdown = async () => {
    try {
      setIsLoading(true)
      const markdown = exportToMarkdown(fractal)
      const blob = new Blob([markdown], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${fractal.title || 'untitled-fractal'}.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('Your fractal outline has been exported as a Markdown file.')
    } catch (error) {
      handleErrorClient('Failed to export the fractal. Please try again.', error)
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
              <FractalOutline fractal={fractal} onUpdate={updateFractal} />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="overview">
            <ErrorBoundary>
              <FractalOverview fractal={fractal} />
            </ErrorBoundary>
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  )
}
