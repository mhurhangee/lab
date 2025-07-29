'use client'

import { ReactRenderer } from '@tiptap/react'
import tippy, { Instance, Props } from 'tippy.js'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { cn } from '@/lib/utils'
import { Editor } from '@tiptap/react'
import './multi-mentions.css'

type MentionType = 'location' | 'event' | 'character'

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

    const upHandler = () => {
      setSelectedIndex((selectedIndex + items.length - 1) % items.length)
    }

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % items.length)
    }

    const enterHandler = () => {
      selectItem(selectedIndex)
    }

    useEffect(() => setSelectedIndex(0), [items])

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (event.key === 'ArrowUp') {
          upHandler()
          return true
        }

        if (event.key === 'ArrowDown') {
          downHandler()
          return true
        }

        if (event.key === 'Enter') {
          enterHandler()
          return true
        }

        return false
      },
    }))

    const getTypeIcon = (type: MentionType) => {
      switch (type) {
        case 'location': return '📍'
        case 'event': return '📅'
        case 'character': return '👤'
        default: return '💬'
      }
    }

    const getTypeLabel = (type: MentionType) => {
      switch (type) {
        case 'location': return 'Location'
        case 'event': return 'Event'
        case 'character': return 'Character'
        default: return 'Mention'
      }
    }

    if (items.length === 0) {
      return (
        <div className="rounded-md border bg-popover p-3 text-sm text-muted-foreground shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{getTypeIcon(type)}</span>
            <span className="font-medium">No {getTypeLabel(type).toLowerCase()}s found</span>
          </div>
          <p className="text-xs">
            Type a new {getTypeLabel(type).toLowerCase()} name to create it
          </p>
        </div>
      )
    }

    return (
      <div className="rounded-md border bg-popover shadow-md">
        {items.map((item, index) => (
          <button
            key={item.id}
            className={cn(
              'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
              index === selectedIndex && 'bg-accent text-accent-foreground'
            )}
            onClick={() => selectItem(index)}
          >
            <span className="text-lg">{getTypeIcon(type)}</span>
            <div className="flex flex-col">
              <span className="font-medium">{item.name}</span>
              <span className="text-xs text-muted-foreground">
                {getTypeLabel(type)} from document
              </span>
            </div>
          </button>
        ))}
      </div>
    )
  }
)

MentionList.displayName = 'MentionList'

// Function to extract existing mentions from the document
const extractMentionsFromDocument = (editor: Editor, type: MentionType): MentionItem[] => {
  const mentions: MentionItem[] = []
  const mentionMap = new Map<string, MentionItem>()

  // Get the document content as JSON
  const doc = editor.getJSON()

  // Recursively traverse the document to find mentions
  const traverseNode = (node: any) => {
    if (node.type === 'mention' || node.type === 'eventMention' || node.type === 'characterMention') {
      const mentionType = node.attrs?.type || 
        (node.type === 'eventMention' ? 'event' : 
         node.type === 'characterMention' ? 'character' : 'location')
      
      if (mentionType === type && node.attrs?.label) {
        const id = node.attrs.id || node.attrs.label
        const name = node.attrs.label
        
        if (!mentionMap.has(id)) {
          mentionMap.set(id, {
            id,
            name,
            type: mentionType as MentionType
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
        return [{
          id: query.trim(),
          name: query.trim(),
          type
        }]
      }

      return filteredMentions.slice(0, 10) // Limit to 10 suggestions
    },

    render: () => {
      let component: ReactRenderer
      let popup: Instance<Props>[]

      return {
        onStart: (props: any) => {
          component = new ReactRenderer(MentionList, {
            props: { ...props, type },
            editor: props.editor,
          })

          if (!props.clientRect) {
            return
          }

          popup = tippy('body', {
            getReferenceClientRect: props.clientRect as () => DOMRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
            theme: `mentions-${type}`,
          })
        },

        onUpdate(props: any) {
          component.updateProps({ ...props, type })

          if (!props.clientRect) {
            return
          }

          popup[0].setProps({
            getReferenceClientRect: props.clientRect as () => DOMRect,
          })
        },

        onKeyDown(props: any) {
          if (props.event.key === 'Escape') {
            popup[0].hide()
            return true
          }

          return (component.ref as MentionListRef)?.onKeyDown(props) || false
        },

        onExit() {
          popup[0].destroy()
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
