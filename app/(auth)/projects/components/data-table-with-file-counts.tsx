'use client'

import { useMemo } from 'react'

import { DataTable as BaseDataTable } from '@/components/data-table/data-table'

import Fuse from 'fuse.js'

import { type ProjectWithFileCount, columnsWithFileCounts } from './columns-with-file-counts'

interface ProjectDataTableWithFileCountsProps {
  data: ProjectWithFileCount[]
}

export function DataTableWithFileCounts({ data }: ProjectDataTableWithFileCountsProps) {
  // Create Fuse instance once with its options
  const fuseInstance = useMemo(() => {
    const fuseOptions = {
      keys: ['title', 'description'],
      threshold: 0.3,
    }
    return new Fuse(data, fuseOptions)
  }, [data])

  const filterProjects = (query: string, projects: ProjectWithFileCount[]): ProjectWithFileCount[] => {
    if (!query) return projects

    const result = fuseInstance.search(query)
    return result.map(item => item.item)
  }

  return (
    <BaseDataTable
      columns={columnsWithFileCounts}
      data={data}
      filterFunction={filterProjects}
      searchPlaceholder="Search projects..."
    />
  )
}
