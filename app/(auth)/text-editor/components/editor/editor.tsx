'use client'

import { EditorContent } from '@tiptap/react'
import type { Editor as TiptapEditor } from '@tiptap/react'

import { Toolbar } from './toolbar'

export const Editor = ({ editor, id }: { editor: TiptapEditor; id: string }) => {
  return (
    <div className="flex h-full flex-col">
      <Toolbar editor={editor} id={id} />
      <div className="shadcn-scrollbar mx-auto h-[calc(100vh-4rem)] w-full items-center justify-center overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
