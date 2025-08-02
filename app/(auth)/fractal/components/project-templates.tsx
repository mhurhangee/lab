'use client'

import {
  BookOpen,
  BotIcon,
  Building,
  Code,
  FileText,
  FolderIcon,
  Search,
  TargetIcon,
  TreesIcon,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

import type { PROJECT_TEMPLATES } from '../lib/fractal-structure'

interface ProjectTemplatesProps {
  onSelectTemplate: (templateName: keyof typeof PROJECT_TEMPLATES) => void
}

const TEMPLATE_INFO = {
  'Book Series': {
    icon: BookOpen,
    description: 'Plan book series with acts, sequences, chapters, and scenes',
    levels: ['Series', 'Book', 'Act', 'Sequence', 'Chapter', 'Scene'],
    color: 'text-purple-600',
  },
  'Software Project': {
    icon: Code,
    description: 'Organize software development with modules, features, and tasks',
    levels: ['Project', 'Module', 'Feature', 'Task'],
    color: 'text-blue-600',
  },
  'Research Project': {
    icon: Search,
    description: 'Structure research with phases, studies, and experiments',
    levels: ['Research', 'Phase', 'Study', 'Experiment'],
    color: 'text-green-600',
  },
  'Business Plan': {
    icon: Building,
    description: 'Create business plans with departments, strategies, and actions',
    levels: ['Business', 'Department', 'Strategy', 'Action'],
    color: 'text-orange-600',
  },
  'Empty Project': {
    icon: FileText,
    description: 'Start with a blank project and define your own structure',
    levels: ['Project'],
    color: 'text-gray-600',
  },
}

export function ProjectTemplates({ onSelectTemplate }: ProjectTemplatesProps) {
  return (
    <div className="space-y-2">
      <div className="bg-muted rounded-lg p-6">
        <h3 className="mb-2 text-2xl font-semibold">How Fractal Planning Works</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="mb-2 flex items-center gap-2 font-medium">
              <TreesIcon className="h-4 w-4" /> Infinite Hierarchy
            </h4>
            <p className="text-muted-foreground text-sm">
              Create as many levels and branches as you need. Each node can have unlimited children.
            </p>
          </div>
          <div>
            <h4 className="mb-2 flex items-center gap-2 font-medium">
              <TargetIcon className="h-4 w-4" /> Status Tracking
            </h4>
            <p className="text-muted-foreground text-sm">
              Track progress with visual status indicators: empty (red), in-progress (yellow),
              complete (green).
            </p>
          </div>
          <div>
            <h4 className="mb-2 flex items-center gap-2 font-medium">
              <BotIcon className="h-4 w-4" /> AI Assistance
            </h4>
            <p className="text-muted-foreground text-sm">
              Get AI suggestions for content and structure at every level of your project.
            </p>
          </div>
          <div>
            <h4 className="mb-2 flex items-center gap-2 font-medium">
              <FolderIcon className="h-4 w-4" /> Flexible Structure
            </h4>
            <p className="text-muted-foreground text-sm">
              Add siblings, create new levels, and organize your project exactly how you think.
            </p>
          </div>
        </div>
        <h2 className="mt-12 mb-2 text-2xl font-bold">Choose a Project Template</h2>
        <p className="text-muted-foreground">
          Start with a template or create your own fractal structure
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(TEMPLATE_INFO).map(([templateName, info]) => {
          const Icon = info.icon
          return (
            <Card key={templateName} className="p-6 transition-shadow hover:shadow-md">
              <div className="mb-4 flex items-center gap-3">
                <Icon className={`h-6 w-6 ${info.color}`} />
                <h3 className="text-lg font-semibold">{templateName}</h3>
              </div>

              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                {info.description}
              </p>

              <div className="mb-4">
                <p className="text-muted-foreground mb-2 text-xs font-medium">Structure Levels:</p>
                <div className="flex flex-wrap gap-1">
                  {info.levels.map(level => (
                    <Badge key={level} variant="outline" className="text-xs">
                      {level}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => onSelectTemplate(templateName as keyof typeof PROJECT_TEMPLATES)}
                className="w-full"
                variant={templateName === 'Empty Project' ? 'outline' : 'default'}
              >
                Use Template
              </Button>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
