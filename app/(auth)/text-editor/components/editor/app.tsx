'use client'

import { type TableOfContentDataItem } from '@tiptap/extension-table-of-contents'
import { Editor as TiptapEditor, useEditor } from '@tiptap/react'

import { useRef, useState } from 'react'
import React from 'react'

import { ContextDB } from '@/types/database'

import { extensions } from './extensions'
import { SplitView } from './split-view'

export function EditorApp({ context }: { context: ContextDB }) {
  const editorRef = useRef<TiptapEditor | null>(null)

  const [tocItems, setTocItems] = useState<TableOfContentDataItem[]>([])

  const editor = useEditor({
    extensions: [...extensions({ setTocItems, editorRef })],
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

  return <SplitView editor={editor} id={context.id} tocItems={tocItems} />
}
