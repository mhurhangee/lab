import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  onTryAgain: () => void
  onClose: () => void
}

export const ErrorState = ({ onTryAgain, onClose }: ErrorStateProps) => {
  return (
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        An error occurred while processing your request. Please try again.
      </AlertDescription>
      <div className="flex gap-2">
        <Button onClick={onTryAgain}>Try again</Button>
        <Button onClick={onClose} variant="outline">
          Close
        </Button>
      </div>
    </Alert>
  )
}
