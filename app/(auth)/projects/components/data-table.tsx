'use client'

import { useMemo } from 'react'

import { DataTable as BaseDataTable } from '@/components/data-table/data-table'

import type { ProjectDB } from '@/types/database'

import Fuse from 'fuse.js'

import { columnsProjects } from './columns'

interface ProjectDataTableProps {
  data: ProjectDB[]
}

export function ProjectsDataTable({ data }: ProjectDataTableProps) {
  // Create Fuse instance once with its options
  const fuseInstance = useMemo(() => {
    const fuseOptions = {
      keys: ['title', 'description'],
      threshold: 0.3,
    }
    return new Fuse(data, fuseOptions)
  }, [data])

  const filterProjects = (query: string, projects: ProjectDB[]): ProjectDB[] => {
    if (!query) return projects

    const result = fuseInstance.search(query)
    return result.map(item => item.item)
  }

  return (
    <BaseDataTable
      columns={columnsProjects}
      data={data}
      filterFunction={filterProjects}
      searchPlaceholder="Search projects..."
    />
  )
}
