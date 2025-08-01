import { Editor as TiptapEditor } from '@tiptap/react'
import { renderToMarkdown } from '@tiptap/static-renderer/pm/markdown'

import { defaultExtensions } from '@/app/(auth)/docs/components/editor/extensions'

export const tiptapToHtml = (tiptap: TiptapEditor) => {
  let html = tiptap.getHTML()

  html = html.replace(/\s(id|data-[^=]+)="[^"]*"/g, '')

  return html
}

export const tiptapToMarkdown = (tiptap: TiptapEditor) => {
  const content = tiptap.getJSON()
  return renderToMarkdown({ extensions: defaultExtensions, content })
}
