'use client'

import { type ReactNode, createContext, useContext, useState } from 'react'

import type { ProjectDB } from '@/types/database'

type ProjectContextType = {
  selectedProject: ProjectDB | null
  setSelectedProject: (project: ProjectDB | null) => void
  // Add additional project-related state or actions here as needed
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export const useProject = () => {
  const context = useContext(ProjectContext)

  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider')
  }

  return context
}

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [selectedProject, setSelectedProject] = useState<ProjectDB | null>(null)

  return (
    <ProjectContext.Provider value={{ selectedProject, setSelectedProject }}>
      {children}
    </ProjectContext.Provider>
  )
}
