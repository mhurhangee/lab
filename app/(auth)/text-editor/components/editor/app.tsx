'use client'

import { type TableOfContentDataItem } from '@tiptap/extension-table-of-contents'
import { Editor as TiptapEditor, useEditor } from '@tiptap/react'

import { useRef, useState } from 'react'
import React from 'react'

import { ContextDB } from '@/types/database'
import { AISelectionDetector } from './bubble-menu/ai-bubble-menu'
import { AIPromptMenu, useAIPrompt } from './ai-prompt-menu'

import { extensions } from './extensions'
import { SplitView } from './split-view'

export function EditorApp({ context }: { context: ContextDB }) {
  const editorRef = useRef<TiptapEditor | null>(null)

  const [tocItems, setTocItems] = useState<TableOfContentDataItem[]>([])
  const [showAIMenu, setShowAIMenu] = useState(false)
  const [aiMenuPosition, setAIMenuPosition] = useState<{ x: number; y: number } | null>(null)
  const [selectedText, setSelectedText] = useState<string>()

  // AI prompt trigger function for slash commands
  const handleTriggerAIPrompt = (position: { x: number; y: number }) => {
    setAIMenuPosition(position)
    setSelectedText(undefined) // No selected text from slash commands
    setShowAIMenu(true)
  }

  // Handle text selection detection
  const handleSelectionDetected = (position: { x: number; y: number }, text: string) => {
    setAIMenuPosition(position)
    setSelectedText(text)
    setShowAIMenu(true)
  }

  const handleCloseAIMenu = () => {
    setShowAIMenu(false)
    setAIMenuPosition(null)
    setSelectedText(undefined)
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
    editor: editor! 
  })

  const handleAISubmitAndClose = async (prompt: string) => {
    try {
      const response = await handleAISubmit(prompt)
      insertAIResponse(response)
      handleCloseAIMenu()
      return response
    } catch (error) {
      console.error('AI prompt failed:', error)
      throw error
    }
  }

  if (!editor) return null

  return (
    <>
      <SplitView editor={editor} id={context.id} tocItems={tocItems} />
      
      {/* AI Selection Detector */}
      <AISelectionDetector
        editor={editor}
        onSelectionDetected={handleSelectionDetected}
      />

      {/* Global AI Prompt Menu */}
      {showAIMenu && (
        <AIPromptMenu
          position={aiMenuPosition}
          onClose={handleCloseAIMenu}
          onSubmit={handleAISubmitAndClose}
          selectedText={selectedText}
        />
      )}
    </>
  )
}
