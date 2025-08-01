'use client'

import { useCallback, useEffect, useState } from 'react'

import { handleErrorClient } from '@/lib/error/client'

import { createPortal } from 'react-dom'

import { ErrorState } from './error-state'
import { PromptInputState } from './input-state'
import { LoadingState } from './loading-state'
import { ResponseState } from './response-state'

type AIPromptState = 'prompt-input' | 'loading' | 'ai-response' | 'error'

interface AIPromptMenuProps {
  position: { x: number; y: number } | null
  onClose: () => void
  onSubmit: (prompt: string) => Promise<string>
  onAccept?: (response: string) => void
}

export const AIPromptMenu = ({ position, onClose, onSubmit, onAccept }: AIPromptMenuProps) => {
  const [state, setState] = useState<AIPromptState>('prompt-input')
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [aiResponse, setAIResponse] = useState('')

  const handlePromptSubmit = useCallback(
    async (prompt: string) => {
      setCurrentPrompt(prompt)
      setState('loading')

      try {
        const response = await onSubmit(prompt)
        setAIResponse(response)
        setState('ai-response')
      } catch (error) {
        handleErrorClient('AI prompt failed:', error)
        setState('error')
      }
    },
    [onSubmit]
  )

  const handleAccept = useCallback(() => {
    // Pass the AI response to parent for insertion
    if (onAccept && aiResponse) {
      onAccept(aiResponse)
    } else {
      // Fallback - just close if no onAccept handler
      onClose()
    }
  }, [onAccept, aiResponse, onClose])

  const handleReject = useCallback(() => {
    onClose()
  }, [onClose])

  const handleTryAgain = useCallback(() => {
    setState('prompt-input')
    setAIResponse('')
    setCurrentPrompt('')
  }, [])

  // Handle dismissal on escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Check if click is outside the menu
      if (!target.closest('[data-ai-prompt-menu]')) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  if (!position) return null

  const renderCurrentState = () => {
    switch (state) {
      case 'prompt-input':
        return (
          <PromptInputState
            onSelectPrompt={handlePromptSubmit}
            onCustomPrompt={handlePromptSubmit}
          />
        )
      case 'loading':
        return <LoadingState prompt={currentPrompt} />
      case 'ai-response':
        return (
          <ResponseState
            response={aiResponse}
            onAccept={handleAccept}
            onReject={handleReject}
            onTryAgain={handleTryAgain}
          />
        )
      case 'error':
        return <ErrorState onTryAgain={handleTryAgain} onClose={handleReject} />
      default:
        return null
    }
  }

  return createPortal(
    <div
      data-ai-prompt-menu
      className="bg-popover fixed z-50 rounded-md border shadow-md"
      style={{
        left: position.x,
        top: position.y + 4,
      }}
      onMouseDown={e => {
        // Only prevent focus loss if clicking on non-interactive elements
        const target = e.target as HTMLElement
        if (!target.closest('input, textarea, button, [role="option"]')) {
          e.preventDefault()
        }
      }}
    >
      {renderCurrentState()}
    </div>,
    document.body
  )
}
