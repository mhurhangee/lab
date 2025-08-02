'use client'

import type React from 'react'

import { AlertCircle, CheckCircle, Clock, FolderTree, Target } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

import type { FractalNode, FractalProject } from '../lib/fractal-structure'
import { calculateProjectStats } from '../lib/fractal-structure'

interface FractalOverviewProps {
  project: FractalProject
}

export function FractalOverview({ project }: FractalOverviewProps) {
  const stats = calculateProjectStats(project)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold">Project Overview</h2>
        <p className="text-muted-foreground">Complete project structure and progress at a glance</p>
      </div>

      {/* Project Summary */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <FolderTree className="h-6 w-6" />
          <Badge className="bg-blue-600">{project.rootNode.levelName}</Badge>
        </div>
        <h3 className="mb-2 text-xl font-bold">{project.rootNode.title || 'Untitled Project'}</h3>
        <p className="text-muted-foreground leading-relaxed">
          {project.rootNode.summary || 'No summary yet...'}
        </p>
      </Card>

      {/* Statistics */}
      <Card className="p-6">
        <h3 className="mb-4 flex items-center gap-2 font-semibold">
          <Target className="h-5 w-5" />
          Project Statistics
        </h3>
        <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-5">
          <div className="bg-muted rounded-lg p-4">
            <div className="text-2xl font-bold">{stats.totalNodes}</div>
            <div className="text-muted-foreground text-sm">Total Nodes</div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">{stats.completeNodes}</div>
            <div className="text-muted-foreground text-sm">Complete</div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgressNodes}</div>
            <div className="text-muted-foreground text-sm">In Progress</div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="text-2xl font-bold text-red-600">{stats.emptyNodes}</div>
            <div className="text-muted-foreground text-sm">Empty</div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="text-2xl font-bold">{stats.completionPercentage}%</div>
            <div className="text-muted-foreground text-sm">Complete</div>
          </div>
        </div>
      </Card>

      {/* Level Breakdown */}
      <Card className="p-6">
        <h3 className="mb-4 font-semibold">Structure Breakdown</h3>
        <div className="space-y-3">
          {Object.entries(stats.levelCounts).map(([levelName, count]) => (
            <div key={levelName} className="bg-muted flex items-center justify-between rounded p-3">
              <div className="flex items-center gap-2">
                <FolderTree className="h-4 w-4" />
                <span className="font-medium">{levelName}</span>
              </div>
              <Badge variant="outline">{count} nodes</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Progress Overview */}
      <Card className="p-6">
        <h3 className="mb-4 font-semibold">Progress Overview</h3>
        <div className="space-y-4">
          <ProgressBar
            icon={<CheckCircle className="h-5 w-5 text-green-600" />}
            label="Complete"
            value={stats.completeNodes}
            total={stats.totalNodes}
            color="bg-green-600"
          />
          <ProgressBar
            icon={<Clock className="h-5 w-5 text-yellow-600" />}
            label="In Progress"
            value={stats.inProgressNodes}
            total={stats.totalNodes}
            color="bg-yellow-600"
          />
          <ProgressBar
            icon={<AlertCircle className="h-5 w-5 text-red-600" />}
            label="Empty"
            value={stats.emptyNodes}
            total={stats.totalNodes}
            color="bg-red-600"
          />
        </div>
      </Card>

      {/* Project Tree Visualization */}
      <Card className="p-6">
        <h3 className="mb-4 font-semibold">Project Structure</h3>
        <div className="max-h-96 space-y-2 overflow-y-auto">
          <NodeTreeView node={project.rootNode} depth={0} />
        </div>
      </Card>
    </div>
  )
}

interface ProgressBarProps {
  icon: React.ReactNode
  label: string
  value: number
  total: number
  color: string
}

function ProgressBar({ icon, label, value, total, color }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0

  return (
    <div className="flex items-center gap-3">
      {icon}
      <div className="flex-1">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-muted-foreground text-sm">{percentage}%</span>
        </div>
        <div className="bg-muted h-2 w-full rounded-full">
          <div
            className={`${color} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}

interface NodeTreeViewProps {
  node: FractalNode
  depth: number
}

function NodeTreeView({ node, depth }: NodeTreeViewProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-3 w-3 text-green-600" />
      case 'in-progress':
        return <Clock className="h-3 w-3 text-yellow-600" />
      default:
        return <AlertCircle className="h-3 w-3 text-red-600" />
    }
  }

  return (
    <div className={`${depth > 0 ? 'ml-6' : ''}`}>
      <div className="flex items-center gap-2 py-1">
        <div className="flex items-center gap-1">
          {Array.from({ length: depth }).map((_, i) => (
            <div key={i} className="bg-muted h-px w-4" />
          ))}
          {depth > 0 && <div className="bg-muted h-px w-2" />}
        </div>
        {getStatusIcon(node.status)}
        <Badge variant="outline" className="text-xs">
          {node.levelName}
        </Badge>
        <span className="text-muted-foreground truncate text-sm">
          {node.title || `Untitled ${node.levelName}`}
        </span>
      </div>
      {node.children.map(child => (
        <NodeTreeView key={child.id} node={child} depth={depth + 1} />
      ))}
    </div>
  )
}
