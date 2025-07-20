'use client'

import { useMemo } from 'react'

import { DataTable as BaseDataTable } from '@/components/data-table/data-table'

import Fuse from 'fuse.js'

import { type FileRecordWithProject, columnsWithProjects } from './columns-with-projects'

interface FileDataTableWithProjectsProps {
  data: FileRecordWithProject[]
}

export function DataTableWithProjects({ data }: FileDataTableWithProjectsProps) {
  // Create Fuse instance once with its options
  const fuseInstance = useMemo(() => {
    const fuseOptions = {
      keys: ['name', 'projectTitle'],
      threshold: 0.3,
    }
    return new Fuse(data, fuseOptions)
  }, [data])

  const filterFiles = (query: string, files: FileRecordWithProject[]): FileRecordWithProject[] => {
    if (!query) return files

    const result = fuseInstance.search(query)
    return result.map(item => item.item)
  }

  return (
    <BaseDataTable
      columns={columnsWithProjects}
      data={data}
      filterFunction={filterFiles}
      searchPlaceholder="Search files and projects..."
    />
  )
}
