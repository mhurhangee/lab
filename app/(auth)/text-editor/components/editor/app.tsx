'use client'

import { Editor as TiptapEditor, useEditor } from '@tiptap/react'

import { useRef, useState } from 'react'

import { ContextDB } from '@/types/database'

import { extensions } from './extensions'
import { SplitView } from './split-view'
import { TableOfContents, getHierarchicalIndexes, type TableOfContentDataItem } from '@tiptap/extension-table-of-contents'
import React from 'react'



export function EditorApp({ context }: { context: ContextDB }) {
  const editorRef = useRef<TiptapEditor | null>(null)

  const [tocItems, setTocItems] = useState<TableOfContentDataItem[]>([])

  const editor = useEditor({
    extensions: [
      ...extensions,
      TableOfContents.configure({
        anchorTypes: ['heading', 'blockquote'],
        getIndex: getHierarchicalIndexes,
        onUpdate(content) {
          setTocItems(content)
        },
      }),
    ],
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

  return <SplitView editor={editor} id={context.id} tocItems={tocItems}/>
}
