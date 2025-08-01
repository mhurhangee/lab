'use client'

import { Editor } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'

import { Button } from '@/components/ui/button'

interface AIBubbleMenuProps {
  editor: Editor
  onOpenAIMenu: (position: { x: number; y: number }, selectedText: string) => void
}

export const AIBubbleMenu = ({ editor, onOpenAIMenu }: AIBubbleMenuProps) => {
  const handleOpenAI = () => {
    const { selection } = editor.state
    const { from, to } = selection

    // Get selected text
    const selectedText = editor.state.doc.textBetween(from, to)

    // Get position for menu
    const coords = editor.view.coordsAtPos(to)

    onOpenAIMenu({ x: coords.left, y: coords.bottom }, selectedText.trim())
  }

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ state }) => {
        const { selection } = state
        const { from, to, empty } = selection

        // Only show when there's actual text selected
        if (empty) return false

        const selectedText = state.doc.textBetween(from, to)
        return selectedText.trim().length > 0
      }}
      options={{
        placement: 'bottom-start',
        offset: 6,
      }}
    >
      <div className="bg-background rounded-lg border p-1 shadow-lg">
        <Button size="sm" variant="ghost" onClick={handleOpenAI} className="h-8 px-2 text-xs">
          <span className="mr-1">🤖</span>
          Ask AI
        </Button>
      </div>
    </BubbleMenu>
  )
}
