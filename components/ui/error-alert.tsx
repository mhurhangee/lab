import { TriangleAlert } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from './alert'

export const ErrorAlert = ({ error }: { error: string }) => {
  return (
    <Alert className="bg-destructive/10 text-destructive border-destructive rounded-md p-4">
      <AlertTitle className="flex items-center gap-2">
        <TriangleAlert className="h-4 w-4" /> An error occurred
      </AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )
}
