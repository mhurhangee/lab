'use client'

import { useRouter } from 'next/navigation'

import { ChevronDownIcon, FolderIcon, FolderPlusIcon, RefreshCwIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Loader } from '@/components/ui/loader'

import { cn } from '@/lib/utils'

import { useProject } from '@/providers/project'

interface ProjectSelectorProps {
  placeholder?: string
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  showRefresh?: boolean
  // Controlled mode props (for forms)
  value?: string | null
  onValueChange?: (projectId: string | null) => void
  controlled?: boolean
}

export function ProjectSelector({
  placeholder = 'Select a project',
  className,
  variant = 'outline',
  size = 'default',
  showRefresh = false,
  value,
  onValueChange,
  controlled = false,
}: ProjectSelectorProps) {
  const router = useRouter()
  const { selectedProject, setSelectedProject, projects, isLoading, error, refreshProjects } =
    useProject()

  // Use controlled value or global selected project
  const currentSelectedProject = controlled
    ? value
      ? projects.find(p => p.id === value) || null
      : null
    : selectedProject

  const handleProjectSelect = (projectId: string | null) => {
    if (controlled && onValueChange) {
      // In controlled mode, call the provided callback
      onValueChange(projectId)
    } else {
      // In uncontrolled mode, update global state
      const project = projects.find(p => p.id === projectId) || null
      setSelectedProject(project)
    }
  }

  const handleRefresh = async () => {
    await refreshProjects()
  }

  const handleNewProject = () => {
    setSelectedProject(null)
    router.push('/projects/new')
  }

  if (error) {
    return (
      <Button
        variant={variant}
        size={size}
        className={cn('text-destructive justify-between', className)}
        onClick={handleRefresh}
      >
        <div className="flex items-center gap-2">
          <FolderIcon className="h-4 w-4" />
          Error loading projects
        </div>
        <RefreshCwIcon className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn('justify-between', className)}
          disabled={isLoading}
        >
          <div className="flex items-center gap-2">
            <FolderIcon className="h-4 w-4" />
            {isLoading ? (
              'Loading projects...'
            ) : currentSelectedProject ? (
              <span className="truncate">{currentSelectedProject.title}</span>
            ) : (
              placeholder
            )}
          </div>
          {isLoading ? <Loader /> : <ChevronDownIcon className="h-4 w-4 opacity-50" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="px-0 py-0">Select Project</DropdownMenuLabel>
          {showRefresh && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCwIcon className={cn('h-3 w-3', isLoading && 'animate-spin')} />
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => handleProjectSelect(null)}
          className={currentSelectedProject === null ? 'bg-accent' : ''}
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
            className={currentSelectedProject?.id === project.id ? 'bg-accent' : ''}
          >
            <div className="flex min-w-0 items-center gap-2">
              <FolderIcon className="h-4 w-4 flex-shrink-0" />
              <div className="flex min-w-0 flex-col">
                <span className="truncate font-medium">{project.title}</span>
                {project.description && (
                  <span className="text-muted-foreground truncate text-xs">
                    {project.description}
                  </span>
                )}
              </div>
            </div>
          </DropdownMenuItem>
        ))}

        {projects.length === 0 && !isLoading && (
          <DropdownMenuItem disabled>
            <div className="text-muted-foreground flex items-center gap-2">
              <FolderIcon className="h-4 w-4" />
              No projects found
            </div>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleNewProject}>
          <div className="flex items-center gap-2">
            <FolderPlusIcon className="h-4 w-4 opacity-50" />
            New project
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
