'use client'

import { type ReactNode, createContext, useContext, useEffect, useState } from 'react'

import { listProjectsAction } from '@/app/actions/projects/list'

import { handleErrorClient } from '@/lib/error/client'

import type { ProjectDB } from '@/types/database'

import useSWR, { mutate } from 'swr'
import { useLocalStorage } from 'usehooks-ts'

type ProjectContextType = {
  selectedProject: ProjectDB | null
  setSelectedProject: (project: ProjectDB | null) => void
  projects: ProjectDB[]
  isLoading: boolean
  error: string | null
  refreshProjects: () => Promise<void>
  mutateProjects: () => void
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export const useProject = () => {
  const context = useContext(ProjectContext)

  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider')
  }

  return context
}

// SWR fetcher function
const projectsFetcher = async () => {
  const { projects, error } = await listProjectsAction()
  if (error) {
    throw new Error(error)
  }
  return projects || []
}

// Global mutate function for projects cache
export const mutateProjectsGlobally = () => {
  mutate('projects')
}

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [selectedProjectId, setSelectedProjectId] = useLocalStorage<string | null>(
    'selectedProjectId',
    null
  )
  const [selectedProject, setSelectedProject] = useState<ProjectDB | null>(null)

  // Use SWR for project data management
  const {
    data: projects = [],
    error,
    isLoading,
    mutate: mutateProjects,
  } = useSWR('projects', projectsFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 5000, // Dedupe requests within 5 seconds
  })

  // Refresh function for manual refresh
  const refreshProjects = async () => {
    await mutateProjects()
  }

  // Wrapper for mutateProjects to match expected signature
  const handleMutateProjects = () => {
    mutateProjects()
  }

  // Load selected project from localStorage when projects are loaded
  useEffect(() => {
    if (selectedProjectId && projects.length > 0) {
      const savedProject = projects.find(p => p.id === selectedProjectId)
      if (savedProject) {
        setSelectedProject(savedProject)
      } else {
        // Clear invalid project ID from localStorage
        setSelectedProjectId(null)
      }
    }
  }, [selectedProjectId, projects, setSelectedProjectId])

  // Enhanced setSelectedProject that also saves to localStorage
  const handleSetSelectedProject = (project: ProjectDB | null) => {
    setSelectedProject(project)
    setSelectedProjectId(project?.id || null)
  }

  return (
    <ProjectContext.Provider
      value={{
        selectedProject,
        setSelectedProject: handleSetSelectedProject,
        projects,
        isLoading,
        error: error?.message || null,
        refreshProjects,
        mutateProjects: handleMutateProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}
