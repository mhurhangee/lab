'use client'

import { Editor as TiptapEditor, useEditor } from '@tiptap/react'

import { useRef } from 'react'

import { ContextDB } from '@/types/database'

import { extensions } from './extensions'
import { SplitView } from './split-view'

export function EditorApp({ context }: { context: ContextDB }) {
  const editorRef = useRef<TiptapEditor | null>(null)

  const editor = useEditor({
    extensions,
    content: context.textDocument || '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        spellcheck: 'false',
      },
    },
    onCreate({ editor }) {
      editorRef.current = editor
    },
  })

  if (!editor) return null

  return <SplitView editor={editor} id={context.id} />
}
