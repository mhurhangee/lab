'use client'

import { useMemo } from 'react'

import { DataTable as BaseDataTable } from '@/components/data-table/data-table'

import type { ContextDB } from '@/types/database'

import Fuse from 'fuse.js'

import { columnsUrls } from './columns'

interface UrlsDataTableProps {
  data: ContextDB[]
  hideProject?: boolean
}

export function UrlsDataTable({ data, hideProject }: UrlsDataTableProps) {
  // Create Fuse instance once with its options
  const fuseInstance = useMemo(() => {
    const fuseOptions = {
      keys: ['name', 'url'],
      threshold: 0.3,
    }
    return new Fuse(data, fuseOptions)
  }, [data])

  const filterUrls = (query: string, urls: ContextDB[]): ContextDB[] => {
    if (!query) return urls

    const result = fuseInstance.search(query)
    return result.map(item => item.item)
  }

  return (
    <BaseDataTable
      columns={columnsUrls}
      data={data}
      filterFunction={filterUrls}
      searchPlaceholder="Search URLs ..."
      columnVisibility={{
        actions: !hideProject,
        projectTitle: !hideProject,
      }}
    />
  )
}
