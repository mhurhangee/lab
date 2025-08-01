'use client'

import { Editor } from '@tiptap/react'

import { useState } from 'react'

import { Wand2Icon } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { AIPromptMenu } from '../ai-prompt-menu'

interface AIPromptButtonProps {
  editor: Editor
  onSubmit: (prompt: string) => Promise<string>
}

export const AIPromptButton = ({ editor, onSubmit }: AIPromptButtonProps) => {
  const [showMenu, setShowMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null)

  const handleClick = () => {
    // Get cursor position or default to end of editor
    const { selection } = editor.state
    const { $from } = selection

    // Get the DOM position of the cursor
    const domPos = editor.view.coordsAtPos($from.pos)

    if (domPos) {
      setMenuPosition({ x: domPos.left, y: domPos.bottom })
      setShowMenu(true)
    }
  }

  const handleClose = () => {
    setShowMenu(false)
    setMenuPosition(null)
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        className="flex items-center gap-2"
        disabled={!editor.isEditable}
      >
        <Wand2Icon />
        Ask AI
      </Button>

      {showMenu && (
        <AIPromptMenu position={menuPosition} onClose={handleClose} onSubmit={onSubmit} />
      )}
    </>
  )
}
