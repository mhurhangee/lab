'use client'

import { Editor as TiptapEditor } from '@tiptap/react'

import { ProjectSelector } from '@/components/project-selector'

import { useAIPrompt } from '../ai-prompt-menu'
import { AIPromptButton } from './ai-prompt-button'
import { DocNameDialog } from './doc-name-dialog'
import { ExportDialog } from './export-button'
import { NodeSelector } from './node-selector'
import { Save } from './save'
import { TranscriptionButton } from './transcription-button'
import { UndoRedo } from './undo-redo'

interface ToolbarProps {
  editor: TiptapEditor
  id: string
  name: string
  setName: (name: string) => void
}

export const Toolbar = ({ editor, id, name, setName }: ToolbarProps) => {
  const { handleAISubmit } = useAIPrompt({ editor })

  return (
    <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 backdrop-blur">
      <div className="flex items-center">
        <div className="flex w-full justify-between">
          <div className="flex flex-shrink-0 items-center gap-2">
            <NodeSelector editor={editor} />
            <AIPromptButton editor={editor} onSubmit={handleAISubmit} />
            <TranscriptionButton editor={editor} />
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            <DocNameDialog name={name} id={id} setName={setName} />
            <ProjectSelector size="sm" variant="ghost" />
          </div>
          <div className="flex-shrink-0">
            <UndoRedo editor={editor} />
            <Save editor={editor} id={id} />
            <ExportDialog editor={editor} />
          </div>
        </div>
      </div>
    </div>
  )
}
