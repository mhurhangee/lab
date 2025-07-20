import type { Row } from '@tanstack/react-table'

// Helper function for case-insensitive sorting of string values
export const caseInsensitiveSort = <T>(rowA: Row<T>, rowB: Row<T>, columnId: string) => {
  const valueA = String(rowA.getValue(columnId) || '').toLowerCase()
  const valueB = String(rowB.getValue(columnId) || '').toLowerCase()
  return valueA.localeCompare(valueB)
}
