'use client'

import { ColumnDef, Row, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { DeleteProjectDialog } from '@/app/(auth)/projects/components/delete-project-dialog'

import { Edit, Eye } from 'lucide-react'

import { Project } from './columns'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
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
                No projects found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export const ActionsCell = ({ row }: { row: Row<Project> }) => {
  const project = row.original

  return (
    <div className="flex items-center gap-2">
      <Link href={`/projects/${project.id}`}>
        <Button variant="ghost" size="icon" title="View">
          <Eye className="h-4 w-4" />
        </Button>
      </Link>
      <Link href={`/projects/${project.id}/edit`}>
        <Button variant="ghost" size="icon" title="Edit">
          <Edit className="h-4 w-4" />
        </Button>
      </Link>
      <DeleteProjectDialog projectId={project.id} size="icon" />
    </div>
  )
}
