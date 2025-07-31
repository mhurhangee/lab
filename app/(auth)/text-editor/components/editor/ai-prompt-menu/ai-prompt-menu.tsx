'use client'

import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
  const [searchValue, setSearchValue] = useState('')

  // Filter examples based on search
  const filteredExamples = PROMPT_EXAMPLES.filter(example =>
    example.label.toLowerCase().includes(searchValue.toLowerCase()) ||
    example.description?.toLowerCase().includes(searchValue.toLowerCase())
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // Allow Shift+Enter for new lines in textarea
      if (e.shiftKey && isLongText) {
        return // Let the textarea handle it
      }
      
      e.preventDefault()
      
      // If there's a search value and no matching examples, send as custom prompt
      if (searchValue.trim() && filteredExamples.length === 0) {
        onCustomPrompt(searchValue.trim())
      } 
      // If there's exactly one filtered example, use that
      else if (filteredExamples.length === 1) {
        onSelectPrompt(filteredExamples[0].prompt)
      }
      // If search value exactly matches an example label, use that
      else {
        const exactMatch = filteredExamples.find(
          example => example.label.toLowerCase() === searchValue.toLowerCase()
        )
        if (exactMatch) {
          onSelectPrompt(exactMatch.prompt)
        } else if (searchValue.trim()) {
          // Send as custom prompt if no exact match
          onCustomPrompt(searchValue.trim())
        }
      }
    }
  }

  const handleSendCustom = () => {
    if (searchValue.trim()) {
      onCustomPrompt(searchValue.trim())
    }
  }

  const isLongText = searchValue.length > 60 || searchValue.includes('\n')

  return (
    <Command className="w-80">
      <div className="border-b">
        <div className="flex items-start p-3 gap-2">
          {isLongText ? (
            <Textarea
              placeholder="Ask AI to edit or generate..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 min-h-[60px] max-h-[120px] resize-none border-none shadow-none focus-visible:ring-0 p-0"
              rows={Math.min(4, Math.max(2, searchValue.split('\n').length))}
            />
          ) : (
            <input
              type="text"
              placeholder="Ask AI to edit or generate..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border-none outline-none bg-transparent text-sm placeholder:text-muted-foreground"
            />
          )}
          {searchValue.trim() && (
            <Button
              size="sm"
              onClick={handleSendCustom}
              className="shrink-0 h-8"
            >
              Send
            </Button>
          )}
        </div>
      </div>
      <CommandList>
        {filteredExamples.length > 0 && (
          <CommandGroup heading="Edit or review selection">
            {filteredExamples.map((example) => (
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
          </CommandGroup>
        )}
        
        {searchValue.trim() && filteredExamples.length === 0 && (
          <CommandGroup heading="Use AI to do more">
            <CommandItem
              className="flex items-center gap-3 cursor-pointer"
              onSelect={() => onCustomPrompt(searchValue.trim())}
            >
              <span className="text-lg">✨</span>
              <div className="flex flex-col">
                <span className="font-medium">Custom: "{searchValue}"</span>
                <span className="text-muted-foreground text-xs">
                  Send this as a custom prompt
                </span>
              </div>
            </CommandItem>
          </CommandGroup>
        )}

        {!searchValue.trim() && filteredExamples.length === 0 && (
          <CommandEmpty>
            <div className="flex items-center gap-2 p-2">
              <span className="text-lg">🤖</span>
              <div>
                <p className="font-medium">No commands found</p>
                <p className="text-muted-foreground text-xs">
                  Type to search or create custom prompt
                </p>
              </div>
            </div>
          </CommandEmpty>
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
      data-ai-prompt-menu
      className="fixed z-50 rounded-md border bg-popover shadow-md"
      style={{
        left: position.x,
        top: position.y + 4,
      }}
      onMouseDown={(e) => {
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