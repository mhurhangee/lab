'use client'

import { JSONContent, ReactRenderer } from '@tiptap/react'
import { Editor } from '@tiptap/react'
import type { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion'

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import { cn } from '@/lib/utils'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'


import './multi-mentions.css'

type MentionType = 'location' | 'event' | 'character'

export interface MentionAttributes {
  id?: string | null
  label?: string | null
  type?: MentionType
}

interface MentionItem {
  id: string
  name: string
  type: MentionType
}

interface MentionListProps {
  items: MentionItem[]
  command: (item: { id: string; label: string; type: MentionType }) => void
  type: MentionType
}

interface MentionListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}

const MentionList = forwardRef<MentionListRef, MentionListProps>(
  ({ items, command, type }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    const selectItem = (index: number) => {
      const item = items[index]
      if (item) {
        command({ id: item.id, label: item.name, type })
      }
    }

    useEffect(() => setSelectedIndex(0), [items])

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (event.key === 'ArrowUp') {
          setSelectedIndex((selectedIndex + items.length - 1) % items.length)
          return true
        }

        if (event.key === 'ArrowDown') {
          setSelectedIndex((selectedIndex + 1) % items.length)
          return true
        }

        if (event.key === 'Enter') {
          selectItem(selectedIndex)
          return true
        }

        return false
      },
    }))

    const getTypeIcon = (type: MentionType) => {
      switch (type) {
        case 'location':
          return '📍'
        case 'event':
          return '📅'
        case 'character':
          return '👤'
        default:
          return '💬'
      }
    }

    const getTypeLabel = (type: MentionType) => {
      switch (type) {
        case 'location':
          return 'Location'
        case 'event':
          return 'Event'
        case 'character':
          return 'Character'
        default:
          return 'Mention'
      }
    }

    return (
      <Command className="w-80">
        <CommandList>
          {items.length === 0 ? (
            <CommandEmpty className="flex items-center gap-2 p-2">
                <span className="text-lg">{getTypeIcon(type)}</span>
                <div>
                  <p className="font-medium">No {getTypeLabel(type).toLowerCase()}s found</p>
                  <p className="text-muted-foreground text-xs">
                    Type a new {getTypeLabel(type).toLowerCase()} name to create it
                  </p>
                </div>
            </CommandEmpty>
          ) : (
            <CommandGroup>
              {items.map((item, index) => (
                <CommandItem
                  key={item.id}
                  className={cn(
                    'flex items-center gap-2 cursor-pointer',
                    index === selectedIndex && 'bg-accent'
                  )}
                  onSelect={() => selectItem(index)}
                >
                  <span className="text-lg">{getTypeIcon(type)}</span>
                  <div className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    )
  }
)

MentionList.displayName = 'MentionList'

// Function to extract existing mentions from the document
const extractMentionsFromDocument = (editor: Editor, type: MentionType): MentionItem[] => {
  const mentionMap = new Map<string, MentionItem>()

  // Get the document content as JSON
  const doc = editor.getJSON()

  // Recursively traverse the document to find mentions
  const traverseNode = (node: JSONContent) => {
    if (
      node.type === 'mention' ||
      node.type === 'eventMention' ||
      node.type === 'characterMention'
    ) {
      const mentionType =
        node.attrs?.type ||
        (node.type === 'eventMention'
          ? 'event'
          : node.type === 'characterMention'
            ? 'character'
            : 'location')

      if (mentionType === type && node.attrs?.label) {
        const id = node.attrs.id || node.attrs.label
        const name = node.attrs.label

        if (!mentionMap.has(id)) {
          mentionMap.set(id, {
            id,
            name,
            type: mentionType as MentionType,
          })
        }
      }
    }

    // Recursively check child nodes
    if (node.content) {
      node.content.forEach(traverseNode)
    }
  }

  if (doc.content) {
    doc.content.forEach(traverseNode)
  }

  return Array.from(mentionMap.values())
}

// Helper function to create dynamic mention suggestions
const createDynamicMentionSuggestion = (type: MentionType) => {
  return {
    items: ({ query, editor }: { query: string; editor: Editor }) => {
      // Extract existing mentions from the document
      const existingMentions = extractMentionsFromDocument(editor, type)

      // Filter based on query
      const filteredMentions = existingMentions.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )

      // If query doesn't match any existing mentions but has content,
      // suggest creating a new one
      if (query.trim() && filteredMentions.length === 0) {
        return [
          {
            id: query.trim(),
            name: query.trim(),
            type,
          },
        ]
      }

      return filteredMentions.slice(0, 10) // Limit to 10 suggestions
    },

    render: () => {
      let component: ReactRenderer
      let popup: HTMLDivElement

      return {
        onStart: (props: SuggestionProps) => {
          component = new ReactRenderer(MentionList, {
            props: { ...props, type },
            editor: props.editor,
          })

          if (!props.clientRect) {
            return
          }

          // Create and position popup with shadcn styling
          popup = document.createElement('div')
          popup.className = 'fixed z-50 rounded-md border bg-popover shadow-md'
          popup.appendChild(component.element)
          document.body.appendChild(popup)

          // Simple positioning
          const rect = props.clientRect()
          if (rect) {
            popup.style.left = `${rect.left}px`
            popup.style.top = `${rect.bottom + 4}px`
          }
        },

        onUpdate(props: SuggestionProps) {
          component.updateProps({ ...props, type })

          if (!props.clientRect || !popup) {
            return
          }

          // Update position
          const rect = props.clientRect()
          if (rect) {
            popup.style.left = `${rect.left}px`
            popup.style.top = `${rect.bottom + 4}px`
          }
        },

        onKeyDown(props: SuggestionKeyDownProps) {
          if (props.event.key === 'Escape') {
            if (popup) {
              popup.style.display = 'none'
            }
            return true
          }

          return (component.ref as MentionListRef)?.onKeyDown(props) || false
        },

        onExit() {
          if (popup && popup.parentNode) {
            popup.parentNode.removeChild(popup)
          }
          component.destroy()
        },
      }
    },
  }
}

// Export dynamic mention suggestions for each type
export const dynamicLocationMentionSuggestion = createDynamicMentionSuggestion('location')
export const dynamicEventMentionSuggestion = createDynamicMentionSuggestion('event')
export const dynamicCharacterMentionSuggestion = createDynamicMentionSuggestion('character')
