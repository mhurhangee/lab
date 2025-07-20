'use client'

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { useMemo, useState } from 'react'

import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterFunction?: (query: string, data: TData[]) => TData[]
  searchPlaceholder?: string
  enableRowSelection?: boolean
  selectedRow?: TData | null
  columnVisibility?: Record<string, boolean>
  onRowSelectionChange?: (row: TData | null) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterFunction,
  searchPlaceholder = 'Search...',
  enableRowSelection = false,
  selectedRow = null,
  columnVisibility = {},
  onRowSelectionChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchQuery, setSearchQuery] = useState('')

  // Apply filtering if a filter function is provided
  const filteredData = useMemo(() => {
    return filterFunction ? filterFunction(searchQuery, data) : data
  }, [filterFunction, searchQuery, data])

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
      columnVisibility,
    },
  })

  return (
    <div className="space-y-4">
      {filterFunction && (
        <div className="flex items-center">
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={selectedRow === row.original ? 'selected' : undefined}
                  className={enableRowSelection ? 'hover:bg-muted/50 cursor-pointer' : ''}
                  onClick={() => {
                    if (enableRowSelection && onRowSelectionChange) {
                      // Toggle selection: if already selected, deselect it; otherwise select it
                      onRowSelectionChange(selectedRow === row.original ? null : row.original)
                    }
                  }}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
