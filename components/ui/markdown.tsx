import { cn } from '@/lib/utils'

import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

export const Markdown = ({ className, children }: { className?: string; children: string }) => {
  return (
    <div className={cn('prose prose-sm dark:prose-invert', className)}>
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{children}</ReactMarkdown>
    </div>
  )
}
