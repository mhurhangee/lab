'use client'

import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Loader } from '@/components/ui/loader'

type AIPromptState = 'prompt-input' | 'loading' | 'ai-response'

export interface AIPromptMenuProps {
  position: { x: number; y: number } | null
  onClose: () => void
  onSubmit: (prompt: string) => Promise<string>
  selectedText?: string
}

interface PromptExample {
  id: string
  label: string
  prompt: string
  icon: string
  description?: string
}

const PROMPT_EXAMPLES: PromptExample[] = [
  {
    id: 'improve',
    label: 'Improve writing',
    prompt: 'Improve the writing style and clarity of this text',
    icon: '✨',
    description: 'Make text clearer and more engaging'
  },
  {
    id: 'fix-grammar',
    label: 'Fix grammar',
    prompt: 'Fix any grammar and spelling mistakes in this text',
    icon: '✅',
    description: 'Correct grammar and spelling errors'
  },
  {
    id: 'make-shorter',
    label: 'Make shorter',
    prompt: 'Make this text more concise while keeping the key points',
    icon: '🔗',
    description: 'Reduce length while preserving meaning'
  },
  {
    id: 'make-longer',
    label: 'Make longer',
    prompt: 'Expand this text with more detail and examples',
    icon: '📝',
    description: 'Add more detail and context'
  },
  {
    id: 'continue',
    label: 'Continue writing',
    prompt: 'Continue writing this text in the same style and tone',
    icon: '▶️',
    description: 'Generate a continuation'
  }
]

const PromptInputState = ({ 
  onSelectPrompt, 
  onCustomPrompt,
  selectedText 
}: {
  onSelectPrompt: (prompt: string) => void
  onCustomPrompt: (prompt: string) => void
  selectedText?: string
}) => {
  const [customPrompt, setCustomPrompt] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)

  const handleCustomSubmit = () => {
    if (customPrompt.trim()) {
      onCustomPrompt(customPrompt.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleCustomSubmit()
    }
  }

  return (
    <Command className="w-80">
      <CommandList>
        <CommandGroup heading="AI Prompts">
          {PROMPT_EXAMPLES.map((example) => (
            <CommandItem
              key={example.id}
              className="flex items-center gap-3 cursor-pointer"
              onSelect={() => onSelectPrompt(example.prompt)}
            >
              <span className="text-lg">{example.icon}</span>
              <div className="flex flex-col">
                <span className="font-medium">{example.label}</span>
                {example.description && (
                  <span className="text-muted-foreground text-xs">
                    {example.description}
                  </span>
                )}
              </div>
            </CommandItem>
          ))}
          
          <CommandItem
            className="flex items-center gap-3 cursor-pointer"
            onSelect={() => setShowCustomInput(true)}
          >
            <span className="text-lg">💬</span>
            <div className="flex flex-col">
              <span className="font-medium">Custom prompt</span>
              <span className="text-muted-foreground text-xs">
                Write your own AI instruction
              </span>
            </div>
          </CommandItem>
        </CommandGroup>

        {showCustomInput && (
          <div className="border-t p-3">
            <div className="space-y-2">
              <Input
                placeholder="Enter your custom prompt..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                className="min-h-[60px] resize-none"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCustomInput(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleCustomSubmit}
                  disabled={!customPrompt.trim()}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        )}

        {selectedText && (
          <div className="border-t p-3">
            <div className="text-xs text-muted-foreground mb-2">Selected text:</div>
            <div className="bg-muted rounded p-2 text-sm max-h-20 overflow-y-auto">
              {selectedText}
            </div>
          </div>
        )}
      </CommandList>
    </Command>
  )
}

const LoadingState = ({ prompt }: { prompt: string }) => {
  return (
    <div className="w-80 p-6 text-center">
      <div className="mx-auto mb-4 flex justify-center">
        <Loader />
      </div>
      <h3 className="font-medium mb-2">AI is thinking...</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Processing: &quot;{prompt}&quot;
      </p>
      <div className="bg-muted rounded p-2 text-xs">
        This may take a few seconds
      </div>
    </div>
  )
}

const AIResponseState = ({ 
  response, 
  onAccept, 
  onReject, 
  onTryAgain 
}: {
  response: string
  onAccept: () => void
  onReject: () => void
  onTryAgain: () => void
}) => {
  return (
    <div className="w-80 max-h-96 overflow-hidden flex flex-col">
      <div className="p-3 border-b">
        <h3 className="font-medium flex items-center gap-2">
          <span>✨</span>
          AI Suggestion
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3">
        <div className="bg-muted rounded p-3 text-sm whitespace-pre-wrap">
          {response}
        </div>
      </div>

      <div className="p-3 border-t flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={onTryAgain}>
          Try again
        </Button>
        <Button variant="outline" size="sm" onClick={onReject}>
          Reject
        </Button>
        <Button size="sm" onClick={onAccept}>
          Accept
        </Button>
      </div>
    </div>
  )
}

export const AIPromptMenu = ({ 
  position, 
  onClose, 
  onSubmit, 
  selectedText 
}: AIPromptMenuProps) => {
  const [state, setState] = useState<AIPromptState>('prompt-input')
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [aiResponse, setAIResponse] = useState('')

  const handlePromptSubmit = useCallback(async (prompt: string) => {
    setCurrentPrompt(prompt)
    setState('loading')

    try {
      const response = await onSubmit(prompt)
      setAIResponse(response)
      setState('ai-response')
    } catch (error) {
      console.error('AI prompt failed:', error)
      // Reset to prompt input on error
      setState('prompt-input')
    }
  }, [onSubmit])

  const handleAccept = useCallback(() => {
    // Insert the AI response into the editor
    // This will be handled by the parent component
    onClose()
  }, [onClose])

  const handleReject = useCallback(() => {
    onClose()
  }, [onClose])

  const handleTryAgain = useCallback(() => {
    setState('prompt-input')
    setAIResponse('')
    setCurrentPrompt('')
  }, [])

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!position) return null

  const renderCurrentState = () => {
    switch (state) {
      case 'prompt-input':
        return (
          <PromptInputState
            onSelectPrompt={handlePromptSubmit}
            onCustomPrompt={handlePromptSubmit}
            selectedText={selectedText}
          />
        )
      case 'loading':
        return <LoadingState prompt={currentPrompt} />
      case 'ai-response':
        return (
          <AIResponseState
            response={aiResponse}
            onAccept={handleAccept}
            onReject={handleReject}
            onTryAgain={handleTryAgain}
          />
        )
      default:
        return null
    }
  }

  return createPortal(
    <div 
      className="fixed z-50 rounded-md border bg-popover shadow-md"
      style={{
        left: position.x,
        top: position.y + 4,
      }}
    >
      {renderCurrentState()}
    </div>,
    document.body
  )
}