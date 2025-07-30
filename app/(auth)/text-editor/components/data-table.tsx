'use client'

import { useMemo } from 'react'

import { DataTable as BaseDataTable } from '@/components/data-table/data-table'

import type { ContextDB } from '@/types/database'

import Fuse from 'fuse.js'

import { columnsTextEditor } from './columns'

interface TextEditorDataTableProps {
  data: ContextDB[]
  hideProject?: boolean
}

export function TextEditorDataTable({ data, hideProject }: TextEditorDataTableProps) {
  // Create Fuse instance once with its options
  const fuseInstance = useMemo(() => {
    const fuseOptions = {
      keys: ['name'],
      threshold: 0.3,
    }
    return new Fuse(data, fuseOptions)
  }, [data])

  const filterDocuments = (query: string, documents: ContextDB[]): ContextDB[] => {
    if (!query) return documents

    const result = fuseInstance.search(query)
    return result.map(item => item.item)
  }

  return (
    <BaseDataTable
      columns={columnsTextEditor}
      data={data}
      filterFunction={filterDocuments}
      searchPlaceholder="Search documents ..."
      columnVisibility={{
        actions: !hideProject,
        projectTitle: !hideProject,
      }}
    />
  )
}
