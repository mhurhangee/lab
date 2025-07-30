import { generateJSON } from '@tiptap/react'

import { marked } from 'marked'

import { defaultExtensions } from '..'

export function markdownToTiptapContent(markdown: string) {
  const html = marked(markdown)
  const json = generateJSON(html as string, defaultExtensions)
  return json.content
}
