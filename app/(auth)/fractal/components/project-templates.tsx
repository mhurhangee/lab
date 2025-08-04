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

import { createEmptyFractal, createEmptyNode } from '../lib/fractal-structure'
import type { Fractal } from '../lib/types'

interface ProjectTemplatesProps {
  onSelectTemplate: (templateName: keyof typeof PROJECT_TEMPLATES) => void
}

export const PROJECT_TEMPLATES = {
  'Book Series': {
    icon: BookOpen,
    description: 'Plan book series with acts, sequences, chapters, and scenes',
    levels: ['Series', 'Book', 'Act', 'Sequence', 'Chapter', 'Scene'],
    color: 'text-purple-600',
    create: (): Fractal => {
      const project = createEmptyFractal()
      project.rootNode.levelName = 'Series'

      // Book 1 with classic three-act structure
      const book1 = createEmptyNode('Book')
      book1.title = 'Book 1'

      const act1 = createEmptyNode('Act')
      act1.title = 'Act I: Setup'
      const seq1 = createEmptyNode('Sequence')
      seq1.title = 'Opening Sequence'
      const chapter1 = createEmptyNode('Chapter')
      chapter1.title = 'Chapter 1'
      const scene1 = createEmptyNode('Scene')
      scene1.title = 'Opening Scene'
      chapter1.children = [scene1]
      seq1.children = [chapter1]
      act1.children = [seq1]

      const act2 = createEmptyNode('Act')
      act2.title = 'Act II: Confrontation'
      const seq2 = createEmptyNode('Sequence')
      seq2.title = 'Rising Action'
      act2.children = [seq2]

      const act3 = createEmptyNode('Act')
      act3.title = 'Act III: Resolution'
      const seq3 = createEmptyNode('Sequence')
      seq3.title = 'Climax & Resolution'
      act3.children = [seq3]

      book1.children = [act1, act2, act3]

      // Book 2 placeholder
      const book2 = createEmptyNode('Book')
      book2.title = 'Book 2'

      project.rootNode.children = [book1, book2]
      return project
    },
  },
  'Software Project': {
    icon: Code,
    description: 'Organize software development with modules, features, and tasks',
    levels: ['Project', 'Module', 'Feature', 'Task'],
    color: 'text-blue-600',
    create: (): Fractal => {
      const project = createEmptyFractal()
      project.rootNode.levelName = 'Project'

      // Frontend Module
      const frontendModule = createEmptyNode('Module')
      frontendModule.title = 'Frontend'

      const authFeature = createEmptyNode('Feature')
      authFeature.title = 'Authentication'
      authFeature.children = [
        Object.assign(createEmptyNode('Task'), { title: 'Login Component' }),
        Object.assign(createEmptyNode('Task'), { title: 'Registration Form' }),
        Object.assign(createEmptyNode('Task'), { title: 'Password Reset' }),
      ]

      const dashboardFeature = createEmptyNode('Feature')
      dashboardFeature.title = 'Dashboard'
      dashboardFeature.children = [
        Object.assign(createEmptyNode('Task'), { title: 'Main Dashboard Layout' }),
        Object.assign(createEmptyNode('Task'), { title: 'Data Visualization' }),
        Object.assign(createEmptyNode('Task'), { title: 'User Profile Section' }),
      ]

      frontendModule.children = [authFeature, dashboardFeature]

      // Backend Module
      const backendModule = createEmptyNode('Module')
      backendModule.title = 'Backend'

      const apiFeature = createEmptyNode('Feature')
      apiFeature.title = 'API Layer'
      apiFeature.children = [
        Object.assign(createEmptyNode('Task'), { title: 'User Authentication API' }),
        Object.assign(createEmptyNode('Task'), { title: 'Data CRUD Operations' }),
        Object.assign(createEmptyNode('Task'), { title: 'File Upload API' }),
      ]

      const databaseFeature = createEmptyNode('Feature')
      databaseFeature.title = 'Database'
      databaseFeature.children = [
        Object.assign(createEmptyNode('Task'), { title: 'Schema Design' }),
        Object.assign(createEmptyNode('Task'), { title: 'Migrations' }),
        Object.assign(createEmptyNode('Task'), { title: 'Seeding' }),
      ]

      backendModule.children = [apiFeature, databaseFeature]

      // Testing Module
      const testingModule = createEmptyNode('Module')
      testingModule.title = 'Testing'

      const unitTestFeature = createEmptyNode('Feature')
      unitTestFeature.title = 'Unit Tests'
      unitTestFeature.children = [
        Object.assign(createEmptyNode('Task'), { title: 'Component Tests' }),
        Object.assign(createEmptyNode('Task'), { title: 'API Tests' }),
      ]

      testingModule.children = [unitTestFeature]

      project.rootNode.children = [frontendModule, backendModule, testingModule]
      return project
    },
  },
  'Research Project': {
    icon: Search,
    description: 'Structure research with phases, studies, and experiments',
    levels: ['Research', 'Phase', 'Study', 'Experiment'],
    color: 'text-green-600',
    create: (): Fractal => {
      const project = createEmptyFractal()
      project.rootNode.levelName = 'Research'

      // Literature Review Phase
      const literaturePhase = createEmptyNode('Phase')
      literaturePhase.title = 'Literature Review'

      const backgroundStudy = createEmptyNode('Study')
      backgroundStudy.title = 'Background Research'
      backgroundStudy.children = [
        Object.assign(createEmptyNode('Experiment'), { title: 'Source Collection' }),
        Object.assign(createEmptyNode('Experiment'), { title: 'Citation Analysis' }),
        Object.assign(createEmptyNode('Experiment'), { title: 'Gap Identification' }),
      ]

      literaturePhase.children = [backgroundStudy]

      // Data Collection Phase
      const dataPhase = createEmptyNode('Phase')
      dataPhase.title = 'Data Collection'

      const surveyStudy = createEmptyNode('Study')
      surveyStudy.title = 'Survey Research'
      surveyStudy.children = [
        Object.assign(createEmptyNode('Experiment'), { title: 'Survey Design' }),
        Object.assign(createEmptyNode('Experiment'), { title: 'Pilot Testing' }),
        Object.assign(createEmptyNode('Experiment'), { title: 'Data Gathering' }),
      ]

      const interviewStudy = createEmptyNode('Study')
      interviewStudy.title = 'Interview Research'
      interviewStudy.children = [
        Object.assign(createEmptyNode('Experiment'), { title: 'Interview Protocol' }),
        Object.assign(createEmptyNode('Experiment'), { title: 'Participant Recruitment' }),
        Object.assign(createEmptyNode('Experiment'), { title: 'Interview Conduct' }),
      ]

      dataPhase.children = [surveyStudy, interviewStudy]

      // Analysis Phase
      const analysisPhase = createEmptyNode('Phase')
      analysisPhase.title = 'Data Analysis'

      const quantAnalysis = createEmptyNode('Study')
      quantAnalysis.title = 'Quantitative Analysis'
      quantAnalysis.children = [
        Object.assign(createEmptyNode('Experiment'), { title: 'Statistical Testing' }),
        Object.assign(createEmptyNode('Experiment'), { title: 'Correlation Analysis' }),
      ]

      analysisPhase.children = [quantAnalysis]

      // Writing Phase
      const writingPhase = createEmptyNode('Phase')
      writingPhase.title = 'Publication'

      const draftStudy = createEmptyNode('Study')
      draftStudy.title = 'Manuscript Writing'
      draftStudy.children = [
        Object.assign(createEmptyNode('Experiment'), { title: 'First Draft' }),
        Object.assign(createEmptyNode('Experiment'), { title: 'Peer Review' }),
        Object.assign(createEmptyNode('Experiment'), { title: 'Final Revision' }),
      ]

      writingPhase.children = [draftStudy]

      project.rootNode.children = [literaturePhase, dataPhase, analysisPhase, writingPhase]
      return project
    },
  },
  'Business Plan': {
    icon: Building,
    description: 'Create business plans with departments, strategies, and actions',
    levels: ['Business', 'Department', 'Strategy', 'Action'],
    color: 'text-orange-600',
    create: (): Fractal => {
      const project = createEmptyFractal()
      project.rootNode.levelName = 'Business'

      // Marketing Department
      const marketingDept = createEmptyNode('Department')
      marketingDept.title = 'Marketing'

      const brandStrategy = createEmptyNode('Strategy')
      brandStrategy.title = 'Brand Development'
      brandStrategy.children = [
        Object.assign(createEmptyNode('Action'), { title: 'Brand Identity Design' }),
        Object.assign(createEmptyNode('Action'), { title: 'Brand Guidelines' }),
        Object.assign(createEmptyNode('Action'), { title: 'Brand Launch Campaign' }),
      ]

      const digitalStrategy = createEmptyNode('Strategy')
      digitalStrategy.title = 'Digital Marketing'
      digitalStrategy.children = [
        Object.assign(createEmptyNode('Action'), { title: 'Website Development' }),
        Object.assign(createEmptyNode('Action'), { title: 'Social Media Strategy' }),
        Object.assign(createEmptyNode('Action'), { title: 'Content Marketing Plan' }),
      ]

      marketingDept.children = [brandStrategy, digitalStrategy]

      // Sales Department
      const salesDept = createEmptyNode('Department')
      salesDept.title = 'Sales'

      const leadStrategy = createEmptyNode('Strategy')
      leadStrategy.title = 'Lead Generation'
      leadStrategy.children = [
        Object.assign(createEmptyNode('Action'), { title: 'Sales Funnel Design' }),
        Object.assign(createEmptyNode('Action'), { title: 'CRM Implementation' }),
        Object.assign(createEmptyNode('Action'), { title: 'Sales Team Training' }),
      ]

      salesDept.children = [leadStrategy]

      // Operations Department
      const operationsDept = createEmptyNode('Department')
      operationsDept.title = 'Operations'

      const processStrategy = createEmptyNode('Strategy')
      processStrategy.title = 'Process Optimization'
      processStrategy.children = [
        Object.assign(createEmptyNode('Action'), { title: 'Workflow Documentation' }),
        Object.assign(createEmptyNode('Action'), { title: 'Quality Assurance Setup' }),
        Object.assign(createEmptyNode('Action'), { title: 'Performance Metrics' }),
      ]

      operationsDept.children = [processStrategy]

      // Finance Department
      const financeDept = createEmptyNode('Department')
      financeDept.title = 'Finance'

      const budgetStrategy = createEmptyNode('Strategy')
      budgetStrategy.title = 'Financial Planning'
      budgetStrategy.children = [
        Object.assign(createEmptyNode('Action'), { title: 'Budget Allocation' }),
        Object.assign(createEmptyNode('Action'), { title: 'Financial Projections' }),
        Object.assign(createEmptyNode('Action'), { title: 'Investment Strategy' }),
      ]

      financeDept.children = [budgetStrategy]

      project.rootNode.children = [marketingDept, salesDept, operationsDept, financeDept]
      return project
    },
  },
  'Empty Project': {
    icon: FileText,
    description: 'Start with a blank project and define your own structure',
    levels: ['Project'],
    color: 'text-gray-600',
    create: createEmptyFractal,
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
        {Object.entries(PROJECT_TEMPLATES).map(([templateName, template]) => {
          const Icon = template.icon
          return (
            <Card key={templateName} className="p-6 transition-shadow hover:shadow-md">
              <div className="mb-4 flex items-center gap-3">
                <Icon className={`h-6 w-6 ${template.color}`} />
                <h3 className="text-lg font-semibold">{templateName}</h3>
              </div>

              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                {template.description}
              </p>

              <div className="mb-4">
                <p className="text-muted-foreground mb-2 text-xs font-medium">Structure Levels:</p>
                <div className="flex flex-wrap gap-1">
                  {template.levels.map(level => (
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
