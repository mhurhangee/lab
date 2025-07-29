'use client'

import { ReactRenderer } from '@tiptap/react'
import tippy, { Instance, Props } from 'tippy.js'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { cn } from '@/lib/utils'
import './multi-mentions.css'

// Sample data for different mention types
const LOCATIONS = [
  { id: '1', name: 'New York City', description: 'The Big Apple' },
  { id: '2', name: 'Paris', description: 'City of Light' },
  { id: '3', name: 'Tokyo', description: 'Capital of Japan' },
  { id: '4', name: 'London', description: 'Capital of England' },
  { id: '5', name: 'San Francisco', description: 'Golden Gate City' },
]

const EVENTS = [
  { id: '1', name: 'Annual Conference', description: 'Yearly tech conference' },
  { id: '2', name: 'Product Launch', description: 'New product announcement' },
  { id: '3', name: 'Team Meeting', description: 'Weekly team sync' },
  { id: '4', name: 'Workshop', description: 'Skills development session' },
  { id: '5', name: 'Hackathon', description: '48-hour coding event' },
]

const CHARACTERS = [
  { id: '1', name: 'Alice Johnson', description: 'Project Manager' },
  { id: '2', name: 'Bob Smith', description: 'Lead Developer' },
  { id: '3', name: 'Carol Davis', description: 'UX Designer' },
  { id: '4', name: 'David Wilson', description: 'DevOps Engineer' },
  { id: '5', name: 'Eve Brown', description: 'QA Specialist' },
]

type MentionType = 'location' | 'event' | 'character'
type MentionItem = typeof LOCATIONS[0] | typeof EVENTS[0] | typeof CHARACTERS[0]

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

    if (items.length === 0) {
      return (
        <div className="rounded-md border bg-popover p-2 text-sm text-muted-foreground shadow-md">
          No {type}s found
        </div>
      )
    }

    const getTypeIcon = (type: MentionType) => {
      switch (type) {
        case 'location': return '📍'
        case 'event': return '📅'
        case 'character': return '👤'
        default: return '💬'
      }
    }

    const getTypeColor = (type: MentionType) => {
      switch (type) {
        case 'location': return 'text-green-600'
        case 'event': return 'text-blue-600'
        case 'character': return 'text-purple-600'
        default: return 'text-gray-600'
      }
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
              <span className={cn("text-xs", getTypeColor(type))}>
                {item.description}
              </span>
            </div>
          </button>
        ))}
      </div>
    )
  }
)

MentionList.displayName = 'MentionList'

// Helper function to create mention suggestions for different types
const createMentionSuggestion = (type: MentionType, data: MentionItem[]) => {
  return {
    items: ({ query }: { query: string }) => {
      return data.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
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

// Export mention suggestions for each type
export const locationMentionSuggestion = createMentionSuggestion('location', LOCATIONS)
export const eventMentionSuggestion = createMentionSuggestion('event', EVENTS)
export const characterMentionSuggestion = createMentionSuggestion('character', CHARACTERS)
