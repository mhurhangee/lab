'use client'

import { Editor as TiptapEditor } from '@tiptap/react'

import { useAIPrompt } from '../ai-prompt-menu'
import { AIPromptButton } from './ai-prompt-button'
import { NodeSelector } from './node-selector'
import { Save } from './save'
import { UndoRedo } from './undo-redo'

export const Toolbar = ({ editor, id }: { editor: TiptapEditor; id: string }) => {
  const { handleAISubmit } = useAIPrompt({ editor })

  return (
    <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 backdrop-blur">
      <div className="flex items-center">
        <div className="flex w-full justify-between">
          <div className="flex flex-shrink-0 items-center gap-2">
            <NodeSelector editor={editor} />
            <AIPromptButton editor={editor} onSubmit={handleAISubmit} />
          </div>
          <div className="flex-shrink-0">
            <UndoRedo editor={editor} />
            <Save editor={editor} id={id} />
          </div>
        </div>
      </div>
    </div>
  )
}
