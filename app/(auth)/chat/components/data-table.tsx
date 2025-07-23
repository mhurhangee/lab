'use client'

import { useMemo } from 'react'

import { DataTable as BaseDataTable } from '@/components/data-table/data-table'

import type { ChatDB } from '@/types/database'

import Fuse from 'fuse.js'

import { columnsChats } from './columns'

interface ChatDataTableProps {
  data: ChatDB[]
}

export function ChatsDataTable({ data }: ChatDataTableProps) {
  // Create Fuse instance once with its options
  const fuseInstance = useMemo(() => {
    const fuseOptions = {
      keys: ['title'],
      threshold: 0.3,
    }
    return new Fuse(data, fuseOptions)
  }, [data])

  const filterChats = (query: string, chats: ChatDB[]): ChatDB[] => {
    if (!query) return chats

    const result = fuseInstance.search(query)
    return result.map(item => item.item)
  }

  return (
    <BaseDataTable
      columns={columnsChats}
      data={data}
      filterFunction={filterChats}
      searchPlaceholder="Search chats..."
    />
  )
}
