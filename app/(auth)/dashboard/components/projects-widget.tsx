'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ErrorAlert } from '@/components/ui/error-alert'

import { formatDate } from '@/lib/date'
import { handleErrorClient } from '@/lib/error/client'

import type { ProjectDB } from '@/types/database'

import { FolderIcon, FoldersIcon } from 'lucide-react'
import { DynamicIcon } from 'lucide-react/dynamic'

import { listProjectsAction } from '@/app/actions/projects/list'

export function ProjectsWidget() {
  const [projects, setProjects] = useState<ProjectDB[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const result = await listProjectsAction()
        if (result.error) {
          setError(result.error)
          handleErrorClient(result.error, 'Failed to load projects')
        } else {
          // Show only the 3 most recent projects
          setProjects(result.projects?.slice(0, 3) || [])
        }
      } catch (err) {
        setError('Failed to load projects')
        handleErrorClient('Failed to load projects', err)
      } finally {
        setLoading(false)
      }
    }

    void fetchProjects()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <DynamicIcon name="folder" className="h-4 w-4" />
            Recent Projects
          </CardTitle>
          <Link href="/projects">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted mb-2 h-4 w-3/4 rounded" />
                <div className="bg-muted h-3 w-1/2 rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <DynamicIcon name="folder" className="h-4 w-4" />
            Recent Projects
          </CardTitle>
          <Link href="/projects">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <ErrorAlert error={error} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FoldersIcon className="h-4 w-4" />
          Recent Projects
        </CardTitle>
        <Link href="/projects">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="text-muted-foreground text-sm">
            No projects yet. Create your first project to get started.
          </div>
        ) : (
          projects.map(project => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <div className="group hover:bg-muted/50 cursor-pointer rounded-lg p-2 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <FolderIcon className="mr-1 h-4 w-4" />
                      <h4 className="group-hover:text-primary truncate text-sm font-medium">
                        {project.title}
                      </h4>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        <DynamicIcon name="clock" className="mr-1 h-3 w-3" />
                        {formatDate(project.updatedAt)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  )
}
