'use client'

import { useMemo } from 'react'

import { DataTable as BaseDataTable } from '@/components/data-table/data-table'

import type { ContextDB } from '@/types/database'

import Fuse from 'fuse.js'

import { columnsPdfs } from './columns'

interface PdfsDataTableProps {
  data: ContextDB[]
  hideProject?: boolean
}

export function PdfsDataTable({ data, hideProject }: PdfsDataTableProps) {
  // Create Fuse instance once with its options
  const fuseInstance = useMemo(() => {
    const fuseOptions = {
      keys: ['name', 'type'],
      threshold: 0.3,
    }
    return new Fuse(data, fuseOptions)
  }, [data])

  const filterFiles = (query: string, files: ContextDB[]): ContextDB[] => {
    if (!query) return files

    const result = fuseInstance.search(query)
    return result.map(item => item.item)
  }

  return (
    <BaseDataTable
      columns={columnsPdfs}
      data={data}
      filterFunction={filterFiles}
      searchPlaceholder="Search files ..."
      columnVisibility={{
        actions: !hideProject,
        projectTitle: !hideProject,
      }}
    />
  )
}
