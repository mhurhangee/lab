import { cn } from '@/lib/utils'

import ReactMarkdown from 'react-markdown'

export const Markdown = ({ className, children }: { className?: string; children: string }) => {
  return (
    <div className={cn('prose prose-sm dark:prose-invert', className)}>
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  )
}
