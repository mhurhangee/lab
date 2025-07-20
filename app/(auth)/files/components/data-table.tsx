'use client'

import { useMemo } from 'react'

import { DataTable as BaseDataTable } from '@/components/data-table/data-table'

import Fuse from 'fuse.js'

import { type FileRecord, columns } from './columns'

interface FileDataTableProps {
  data: FileRecord[]
}

export function DataTable({ data }: FileDataTableProps) {
  // Create Fuse instance once with its options
  const fuseInstance = useMemo(() => {
    const fuseOptions = {
      keys: ['name'],
      threshold: 0.3,
    }
    return new Fuse(data, fuseOptions)
  }, [data])

  const filterFiles = (query: string, files: FileRecord[]): FileRecord[] => {
    if (!query) return files

    const result = fuseInstance.search(query)
    return result.map(item => item.item)
  }

  return (
    <BaseDataTable
      columns={columns}
      data={data}
      searchPlaceholder="Search files..."
      filterFunction={filterFiles}
    />
  )
}
