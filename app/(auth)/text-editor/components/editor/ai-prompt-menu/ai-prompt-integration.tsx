'use client'

import { Editor } from '@tiptap/react'
import { useState } from 'react'

import { AIPromptMenu, useAIPrompt } from './index'
import { AIPromptButton } from '../toolbar/ai-prompt-button'
import { AISelectionDetector } from '../bubble-menu/ai-bubble-menu'

interface AIPromptIntegrationProps {
  editor: Editor
}

/**
 * Comprehensive AI Prompt Integration Component
 * 
 * This component demonstrates how to integrate the AI prompt system
 * across multiple triggers: slash commands, toolbar, and bubble menu.
 * 
 * Usage:
 * 1. Import this component in your editor
 * 2. Pass your editor instance
 * 3. Set up the slash command extension separately (see example below)
 */
export const AIPromptIntegration = ({ editor }: AIPromptIntegrationProps) => {
  const [showMenu, setShowMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null)
  const [selectedText, setSelectedText] = useState<string>()
  
  const { handleAISubmit, insertAIResponse } = useAIPrompt({ editor })

  // Global AI prompt trigger function that can be called from anywhere
  // This function can be exported and used by slash commands or other triggers
  const triggerAIPrompt = (position: { x: number; y: number }, text?: string) => {
    setMenuPosition(position)
    setSelectedText(text)
    setShowMenu(true)
  }

  // Handle selection detection from the AISelectionDetector
  const handleSelectionDetected = (position: { x: number; y: number }, text: string) => {
    triggerAIPrompt(position, text)
  }

  const handleClose = () => {
    setShowMenu(false)
    setMenuPosition(null)
    setSelectedText(undefined)
  }

  const handleSubmit = async (prompt: string) => {
    try {
      const response = await handleAISubmit(prompt)
      
      // Auto-insert the response and close menu
      insertAIResponse(response)
      handleClose()
      
      return response
    } catch (error) {
      console.error('AI prompt failed:', error)
      throw error
    }
  }

  return (
    <>
      {/* Toolbar Button - always visible */}
      <AIPromptButton
        editor={editor}
        onSubmit={handleSubmit}
      />

      {/* Selection Detector - automatically detects text selection */}
      <AISelectionDetector
        editor={editor}
        onSelectionDetected={handleSelectionDetected}
      />

      {/* Global AI Prompt Menu - can be triggered from anywhere */}
      {showMenu && (
        <AIPromptMenu
          position={menuPosition}
          onClose={handleClose}
          onSubmit={handleSubmit}
          selectedText={selectedText}
        />
      )}
    </>
  )
}

/**
 * Example of how to set up the slash command extension:
 * 
 * In your editor setup, add this to your extensions:
 * 
 * ```typescript
 * import { Suggestion } from '@tiptap/suggestion'
 * import { createAIPromptSlashSuggestion } from './extensions/ai-prompt-slash/ai-prompt-slash'
 * 
 * const editor = useEditor({
 *   extensions: [
 *     // ... other extensions
 *     
 *     // Slash command for AI prompts
 *     Suggestion.configure({
 *       suggestion: createAIPromptSlashSuggestion((position) => {
 *         // This function will be called when AI prompt is triggered via slash
 *         triggerAIPrompt(position)
 *       })
 *     })
 *   ]
 * })
 * ```
 * 
 * This creates a unified system where:
 * - Type `/ai` to open AI prompt menu
 * - Click toolbar button to open AI prompt menu  
 * - Select text to automatically show AI prompt options
 * - All use the same AIPromptMenu component with consistent UX
 */

export default AIPromptIntegration