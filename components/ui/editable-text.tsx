'use client'

import type React from 'react'
import { useEffect, useRef, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { cn } from '@/lib/utils'

interface EditableTextProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  multiline?: boolean
  className?: string
}

export function EditableText({
  value,
  onChange,
  placeholder = '',
  multiline = false,
  className = '',
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const initialCursorPosition = useRef<number>(0)

  useEffect(() => {
    setEditValue(value)
  }, [value])

  // TODO: check this fix
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      // Only set cursor to end when we first start editing, not on every change
      if (multiline && inputRef.current instanceof HTMLTextAreaElement) {
        inputRef.current.setSelectionRange(
          initialCursorPosition.current,
          initialCursorPosition.current
        )
      } else if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.setSelectionRange(
          initialCursorPosition.current,
          initialCursorPosition.current
        )
      }
    }
  }, [isEditing, multiline])

  const handleSave = () => {
    onChange(editValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Enter' && e.ctrlKey && multiline) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (isEditing) {
    if (multiline) {
      return (
        <Textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn('bg-input min-h-[80px] resize-none', className)}
          rows={3}
        />
      )
    } else {
      return (
        <Input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn('bg-input', className)}
        />
      )
    }
  }

  const handleStartEditing = () => {
    initialCursorPosition.current = editValue.length
    setIsEditing(true)
  }

  return (
    <div
      onClick={handleStartEditing}
      className={cn(
        'hover:bg-input flex min-h-[40px] cursor-text items-center rounded border border-transparent p-2 transition-colors',
        !value && 'text-muted-foreground',
        className
      )}
    >
      {value || placeholder}
    </div>
  )
}
