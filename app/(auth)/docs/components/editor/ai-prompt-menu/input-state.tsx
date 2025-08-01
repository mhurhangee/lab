import { useState } from 'react'

import { SendIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

import { PROMPT_EXAMPLES } from './examples'

export const PromptInputState = ({
  onSelectPrompt,
  onCustomPrompt,
}: {
  onSelectPrompt: (prompt: string) => void
  onCustomPrompt: (prompt: string) => void
}) => {
  const [searchValue, setSearchValue] = useState('')

  // Filter examples based on search
  const filteredExamples = PROMPT_EXAMPLES.filter(
    example =>
      example.label.toLowerCase().includes(searchValue.toLowerCase()) ||
      example.description?.toLowerCase().includes(searchValue.toLowerCase())
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
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

  return (
    <Command className="w-120">
      <div className="border-b">
        <div className="flex min-h-9 items-start">
          <input
            type="text"
            placeholder="Ask AI to edit or generate..."
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="placeholder:text-muted-foreground ml-2 h-9 flex-1 border-none bg-transparent text-sm outline-none"
          />

          {searchValue.trim() && (
            <Button size="icon" onClick={handleSendCustom}>
              <SendIcon className="m-0 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <CommandList>
        {filteredExamples.length > 0 && (
          <CommandGroup heading="Edit or review selection">
            {filteredExamples.map(example => (
              <CommandItem
                key={example.id}
                className="flex cursor-pointer items-center gap-3"
                onSelect={() => onSelectPrompt(example.prompt)}
              >
                <span className="text-lg">{example.icon}</span>
                <div className="flex flex-col">
                  <span className="font-medium">{example.label}</span>
                  {example.description && (
                    <span className="text-muted-foreground text-xs">{example.description}</span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {searchValue.trim() && filteredExamples.length === 0 && (
          <CommandGroup heading="Use AI to do more">
            <CommandItem
              className="flex cursor-pointer items-center gap-3"
              onSelect={() => onCustomPrompt(searchValue.trim())}
            >
              <span className="text-lg">✨</span>
              <div className="flex flex-col">
                <span className="font-medium">Custom: &quot;{searchValue}&quot;</span>
                <span className="text-muted-foreground text-xs">Send this as a custom prompt</span>
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
      </CommandList>
    </Command>
  )
}
