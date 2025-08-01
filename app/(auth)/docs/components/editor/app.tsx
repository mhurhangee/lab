'use client'

import { type TableOfContentDataItem } from '@tiptap/extension-table-of-contents'
import { Editor as TiptapEditor, useEditor } from '@tiptap/react'

import { useRef, useState } from 'react'
import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'

import { ContextDB } from '@/types/database'

import { AIPromptMenu, useAIPrompt } from './ai-prompt-menu'
import { AIBubbleMenu } from './bubble-menu/ai-bubble-menu'
import { extensions } from './extensions'
import { SplitView } from './split-view'

export function EditorApp({ context }: { context: ContextDB }) {
  const editorRef = useRef<TiptapEditor | null>(null)

  const [tocItems, setTocItems] = useState<TableOfContentDataItem[]>([])
  const [showAIMenu, setShowAIMenu] = useState(false)
  const [aiMenuPosition, setAIMenuPosition] = useState<{ x: number; y: number } | null>(null)
  const [name, setName] = useState(context.name)

  // AI prompt trigger function for slash commands
  const handleTriggerAIPrompt = (position: { x: number; y: number }) => {
    setAIMenuPosition(position)
    setShowAIMenu(true)
  }

  // Handle bubble menu AI trigger
  const handleBubbleMenuAI = (position: { x: number; y: number }) => {
    setAIMenuPosition(position)
    setShowAIMenu(true)
  }

  const handleCloseAIMenu = () => {
    setShowAIMenu(false)
    setAIMenuPosition(null)
  }

  const editor = useEditor({
    extensions: [
      ...extensions({
        setTocItems,
        editorRef,
        onTriggerAIPrompt: handleTriggerAIPrompt,
      }),
    ],
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
  })

  const handleAIAccept = (response: string) => {
    insertAIResponse(response)
    handleCloseAIMenu()
  }

  if (!editor) return <Skeleton className="h-full w-full p-4" />

  return (
    <>
      <SplitView
        editor={editor}
        id={context.id}
        name={name}
        tocItems={tocItems}
        setName={setName}
      />

      {/* AI Selection Detector */}
      <AIBubbleMenu editor={editor} onOpenAIMenu={handleBubbleMenuAI} />

      {/* Global AI Prompt Menu */}
      {showAIMenu && (
        <AIPromptMenu
          position={aiMenuPosition}
          onClose={handleCloseAIMenu}
          onSubmit={handleAISubmit}
          onAccept={handleAIAccept}
        />
      )}
    </>
  )
}
