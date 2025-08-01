'use client'

import { EditorContent } from '@tiptap/react'
import type { Editor as TiptapEditor } from '@tiptap/react'

import { Toolbar } from './toolbar'

interface EditorProps {
  editor: TiptapEditor
  id: string
  name: string
  setName: (name: string) => void
}

export const Editor = ({ editor, id, name, setName }: EditorProps) => {
  return (
    <div className="flex h-full flex-col">
      <Toolbar editor={editor} id={id} name={name} setName={setName} />
      <div className="shadcn-scrollbar mx-auto h-[calc(100vh-4rem)] w-full items-center justify-center overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
