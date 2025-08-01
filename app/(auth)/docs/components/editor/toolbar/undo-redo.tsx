'use client'

import { Editor as TiptapEditor } from '@tiptap/react'

import { Redo, Undo } from 'lucide-react'

import { Button } from '@/components/ui/button'

export const UndoRedo = ({ editor }: { editor: TiptapEditor }) => {
  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().undo().run()}>
        <Undo className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().redo().run()}>
        <Redo className="h-4 w-4" />
      </Button>
    </>
  )
}
