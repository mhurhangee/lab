'use client'

import { type TableOfContentDataItem } from '@tiptap/extension-table-of-contents'
import { Editor as TiptapEditor, useEditor } from '@tiptap/react'

import { useRef, useState } from 'react'
import React from 'react'

import { ContextDB } from '@/types/database'
import { AIBubbleMenu } from './bubble-menu/ai-bubble-menu'
import { AIPromptMenu, useAIPrompt } from './ai-prompt-menu'

import { extensions } from './extensions'
import { SplitView } from './split-view'

export function EditorApp({ context }: { context: ContextDB }) {
  const editorRef = useRef<TiptapEditor | null>(null)

  const [tocItems, setTocItems] = useState<TableOfContentDataItem[]>([])
  const [showAIMenu, setShowAIMenu] = useState(false)
  const [aiMenuPosition, setAIMenuPosition] = useState<{ x: number; y: number } | null>(null)
  const [selectedText, setSelectedText] = useState<string>()
  const [preservedSelection, setPreservedSelection] = useState<{ from: number; to: number; empty: boolean } | null>(null)

  // AI prompt trigger function for slash commands
  const handleTriggerAIPrompt = (position: { x: number; y: number }) => {
    // Store current selection for slash commands
    if (editor) {
      const { selection } = editor.state
      setPreservedSelection({ from: selection.from, to: selection.to, empty: selection.empty })
    }
    setAIMenuPosition(position)
    setSelectedText(undefined) // No selected text from slash commands
    setShowAIMenu(true)
  }

  // Handle bubble menu AI trigger
  const handleBubbleMenuAI = (position: { x: number; y: number }, text: string) => {
    // Get current selection when bubble menu triggers
    if (editor) {
      const { selection } = editor.state
      setPreservedSelection({ from: selection.from, to: selection.to, empty: selection.empty })
    }
    setAIMenuPosition(position)
    setSelectedText(text)
    setShowAIMenu(true)
  }

  const handleCloseAIMenu = () => {
    setShowAIMenu(false)
    setAIMenuPosition(null)
    setSelectedText(undefined)
    setPreservedSelection(null)
  }



  const editor = useEditor({
    extensions: [...extensions({ 
      setTocItems, 
      editorRef, 
      onTriggerAIPrompt: handleTriggerAIPrompt 
    })],
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

  const { handleAISubmit, insertAIResponse } = useAIPrompt({ 
    editor: editor!,
    preservedSelection
  })

  const handleAISubmitAndClose = async (prompt: string) => {
    // Just return the AI response - let the AI menu handle the suggestion flow
    return await handleAISubmit(prompt)
  }

  const handleAIAccept = (response: string) => {
    // Only insert response when user explicitly accepts
    insertAIResponse(response)
    handleCloseAIMenu()
  }

  if (!editor) return null

  return (
    <>
      <SplitView editor={editor} id={context.id} tocItems={tocItems} />
      
      {/* AI Selection Detector */}
              <AIBubbleMenu
          editor={editor}
          onOpenAIMenu={handleBubbleMenuAI}
        />

      {/* Global AI Prompt Menu */}
      {showAIMenu && (
        <AIPromptMenu
          position={aiMenuPosition}
          onClose={handleCloseAIMenu}
          onSubmit={handleAISubmitAndClose}
          onAccept={handleAIAccept}
          selectedText={selectedText}
        />
      )}
    </>
  )
}
