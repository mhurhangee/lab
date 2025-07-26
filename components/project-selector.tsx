'use client'

import { useState } from 'react'

import { ChevronDownIcon, FolderIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useProject } from '@/providers/project'

import type { ProjectDB } from '@/types/database'

interface ProjectSelectorProps {
  projects: ProjectDB[]
  selectedProjectId?: string | null
  onProjectSelect: (projectId: string | null) => void
  placeholder?: string
  className?: string
}

export function ProjectSelector({
  projects,
  selectedProjectId,
  onProjectSelect,
  placeholder = 'Select a project',
  className,
}: ProjectSelectorProps) {
  const { selectedProject } = useProject()

  // Use the selected project from context as default if no selectedProjectId is provided
  const defaultProjectId = selectedProjectId ?? selectedProject?.id ?? null
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(defaultProjectId)

  const selectedProject_ = projects.find(p => p.id === currentProjectId)

  const handleProjectSelect = (projectId: string | null) => {
    setCurrentProjectId(projectId)
    onProjectSelect(projectId)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={`w-full justify-between ${className}`}>
          <div className="flex items-center gap-2">
            <FolderIcon className="h-4 w-4" />
            {selectedProject_ ? selectedProject_.title : placeholder}
          </div>
          <ChevronDownIcon className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select Project</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => handleProjectSelect(null)}
          className={currentProjectId === null ? 'bg-accent' : ''}
        >
          <div className="flex items-center gap-2">
            <FolderIcon className="h-4 w-4 opacity-50" />
            No project
          </div>
        </DropdownMenuItem>

        {projects.map(project => (
          <DropdownMenuItem
            key={project.id}
            onClick={() => handleProjectSelect(project.id)}
            className={currentProjectId === project.id ? 'bg-accent' : ''}
          >
            <div className="flex items-center gap-2">
              <FolderIcon className="h-4 w-4" />
              <div className="flex flex-col">
                <span className="font-medium">{project.title}</span>
                {project.description && (
                  <span className="text-muted-foreground truncate text-xs">
                    {project.description}
                  </span>
                )}
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
