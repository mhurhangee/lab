import { Button } from '@/components/ui/button'

interface ResponseStateProps {
  response: string
  onAccept: () => void
  onReject: () => void
  onTryAgain: () => void
}

export const ResponseState = ({ response, onAccept, onReject, onTryAgain }: ResponseStateProps) => {
  return (
    <div className="flex max-h-96 w-80 flex-col overflow-hidden">
      <div className="border-b p-3">
        <h3 className="flex items-center gap-2 font-medium">
          <span>✨</span>
          AI Suggestion
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="bg-muted rounded p-3 text-sm whitespace-pre-wrap">{response}</div>
      </div>

      <div className="flex justify-end gap-2 border-t p-3">
        <Button variant="outline" size="sm" onClick={onTryAgain}>
          Try again
        </Button>
        <Button variant="outline" size="sm" onClick={onReject}>
          Reject
        </Button>
        <Button size="sm" onClick={onAccept}>
          Accept
        </Button>
      </div>
    </div>
  )
}
