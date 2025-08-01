import { Loader } from '@/components/ui/loader'

export const LoadingState = ({ prompt }: { prompt: string }) => {
  return (
    <div className="w-80 p-6 text-center">
      <div className="mx-auto mb-4 flex justify-center">
        <Loader />
      </div>
      <h3 className="mb-2 font-medium">AI is thinking...</h3>
      <p className="text-muted-foreground mb-4 text-sm">Processing: &quot;{prompt}&quot;</p>
      <div className="bg-muted rounded p-2 text-xs">This may take a few seconds</div>
    </div>
  )
}
