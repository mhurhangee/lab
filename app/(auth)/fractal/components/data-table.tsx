'use client'

import { useMemo } from 'react'

import { DataTable as BaseDataTable } from '@/components/data-table/data-table'

import type { ContextDB } from '@/types/database'

import Fuse from 'fuse.js'

import { columnsFractals } from './columns'

interface FractalDataTableProps {
  data: ContextDB[]
  hideProject?: boolean
}

export function FractalDataTable({ data, hideProject }: FractalDataTableProps) {
  // Create Fuse instance once with its options
  const fuseInstance = useMemo(() => {
    const fuseOptions = {
      keys: ['name'],
      threshold: 0.3,
    }
    return new Fuse(data, fuseOptions)
  }, [data])

  const filterFractals = (query: string, fractals: ContextDB[]): ContextDB[] => {
    if (!query) return fractals

    const result = fuseInstance.search(query)
    return result.map(item => item.item)
  }

  return (
    <BaseDataTable
      columns={columnsFractals}
      data={data}
      filterFunction={filterFractals}
      searchPlaceholder="Search fractals ..."
      columnVisibility={{
        actions: !hideProject,
        projectTitle: !hideProject,
      }}
    />
  )
}
