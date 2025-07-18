'use client'

import { useMemo } from 'react'

import { DataTable as BaseDataTable } from '@/components/data-table/data-table'

import Fuse from 'fuse.js'

import { useProject } from '@/providers/project'

import { Project, columns } from './columns'

interface ProjectDataTableProps {
  data: Project[]
}

export function DataTable({ data }: ProjectDataTableProps) {
  const { selectedProject, setSelectedProject } = useProject()

  // Create Fuse instance once with its options
  const fuseInstance = useMemo(() => {
    const fuseOptions = {
      keys: ['title', 'description'],
      threshold: 0.3,
    }
    return new Fuse(data, fuseOptions)
  }, [data])

  const filterProjects = (query: string, projects: Project[]): Project[] => {
    if (!query) return projects

    const result = fuseInstance.search(query)
    return result.map(item => item.item)
  }

  return (
    <BaseDataTable
      columns={columns}
      data={data}
      searchPlaceholder="Search projects..."
      filterFunction={filterProjects}
      enableRowSelection
      selectedRow={selectedProject}
      onRowSelectionChange={setSelectedProject}
    />
  )
}
