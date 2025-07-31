'use client'

import { Editor } from '@tiptap/react'
import { useState } from 'react'

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

  const selectedText = editor.state.selection.empty 
    ? undefined 
    : editor.state.doc.textBetween(
        editor.state.selection.from, 
        editor.state.selection.to
      )

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        className="flex items-center gap-2"
        disabled={!editor.isEditable}
      >
        <span>🤖</span>
        AI Prompt
      </Button>

      {showMenu && (
        <AIPromptMenu
          position={menuPosition}
          onClose={handleClose}
          onSubmit={onSubmit}
          selectedText={selectedText}
        />
      )}
    </>
  )
}