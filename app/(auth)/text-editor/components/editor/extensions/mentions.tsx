'use client'

import { ReactRenderer } from '@tiptap/react'
import tippy, { Instance, Props } from 'tippy.js'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { cn } from '@/lib/utils'

// Sample users data - replace with your actual data source
const USERS = [
  { id: '1', name: 'John Doe', username: 'johndoe', avatar: '👤' },
  { id: '2', name: 'Jane Smith', username: 'janesmith', avatar: '👩' },
  { id: '3', name: 'Bob Johnson', username: 'bobjohnson', avatar: '👨' },
  { id: '4', name: 'Alice Brown', username: 'alicebrown', avatar: '👩‍💼' },
  { id: '5', name: 'Charlie Wilson', username: 'charliewilson', avatar: '👨‍💻' },
]

interface MentionListProps {
  items: typeof USERS
  command: (item: { id: string; label: string }) => void
}

interface MentionListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}

const MentionList = forwardRef<MentionListRef, MentionListProps>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    const selectItem = (index: number) => {
      const item = items[index]
      if (item) {
        command({ id: item.id, label: item.name })
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
          No users found
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
            <span className="text-lg">{item.avatar}</span>
            <div className="flex flex-col">
              <span className="font-medium">{item.name}</span>
              <span className="text-xs text-muted-foreground">@{item.username}</span>
            </div>
          </button>
        ))}
      </div>
    )
  }
)

MentionList.displayName = 'MentionList'

export const mentionSuggestion = {
  items: ({ query }: { query: string }) => {
    return USERS.filter(user =>
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.username.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5)
  },

  render: () => {
    let component: ReactRenderer
    let popup: Instance<Props>[]

    return {
      onStart: (props: any) => {
        component = new ReactRenderer(MentionList, {
          props,
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
        })
      },

      onUpdate(props: any) {
        component.updateProps(props)

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
