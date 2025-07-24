import { cn } from '@/lib/utils'

import 'highlight.js/styles/github-dark.css'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'

export const Markdown = ({ className, children }: { className?: string; children: string }) => {
  return (
    <div className={cn('prose prose-sm dark:prose-invert', className)}>
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{children}</ReactMarkdown>
    </div>
  )
}
