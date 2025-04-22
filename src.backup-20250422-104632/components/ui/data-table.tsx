'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Globe, MapPin, Building2, Tag } from 'lucide-react'
import { ReactNode } from 'react'

interface Column<T> {
  header: string | (() => ReactNode)
  accessorKey?: string
  cell?: (row: T) => ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  isLoading?: boolean
  emptyMessage?: string
}

export function DataTable<T>({
  data,
  columns,
  isLoading = false,
  emptyMessage = "Nenhum resultado encontrado"
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!data?.length) {
    return (
      <div className="w-full h-48 flex flex-col items-center justify-center text-gray-500">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead 
                key={column.accessorKey || index}
                className="bg-gray-50 text-gray-600 font-medium py-4 px-4 whitespace-nowrap"
              >
                {typeof column.header === 'function' ? column.header() : column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow 
              key={rowIndex}
              className="hover:bg-gray-50/75 transition-colors duration-150"
            >
              {columns.map((column, columnIndex) => (
                <TableCell 
                  key={column.accessorKey || columnIndex}
                  className="py-4 px-4"
                >
                  {column.cell ? column.cell(row) : column.accessorKey ? (row as any)[column.accessorKey] : null}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 