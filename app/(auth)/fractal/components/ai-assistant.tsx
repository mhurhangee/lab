'use client'

import { useState } from 'react'

import { Lightbulb, Loader2, RefreshCw, TreePine, Wand2, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface AISuggestion {
  type: 'title' | 'summary'
  content: string
}

interface AIAssistantProps {
  context: string
  level: string
  onSuggestion: (suggestion: AISuggestion) => void
  onChildrenGenerated?: (
    children: Array<{ title: string; summary: string; levelName: string }>
  ) => void
  onDismiss: () => void
  mode?: 'content' | 'children'
  childLevelName?: string
}

export function AIAssistant({
  context,
  level,
  onSuggestion,
  onChildrenGenerated,
  onDismiss,
  mode = 'content',
  childLevelName = '',
}: AIAssistantProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<{ title?: string; summary?: string }>({})
  const [childSuggestions, setChildSuggestions] = useState<
    Array<{ title: string; summary: string; levelName: string }>
  >([])
  const [customPrompt, setCustomPrompt] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Different styling for different modes
  const isChildrenMode = mode === 'children'
  const cardBg = isChildrenMode ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'
  const iconColor = isChildrenMode ? 'text-green-600' : 'text-blue-600'
  const buttonColor = isChildrenMode
    ? 'bg-green-600 hover:bg-green-700'
    : 'bg-blue-600 hover:bg-blue-700'

  const generateSuggestions = async (prompt?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      if (mode === 'children') {
        const response = await fetch('/api/ai-children', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            context,
            childLevelName,
            customPrompt: prompt,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to generate child suggestions')
        }

        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        setChildSuggestions(data.children || [])
      } else {
        const response = await fetch('/api/ai-content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            context,
            level,
            customPrompt: prompt,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to generate content suggestions')
        }

        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        setSuggestions(data.suggestions)
      }
    } catch (error) {
      console.error('Error generating suggestions:', error)
      setError(error instanceof Error ? error.message : 'Failed to generate suggestions')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCustomPrompt = async () => {
    if (!customPrompt.trim()) return
    await generateSuggestions(customPrompt)
    setCustomPrompt('')
  }

  const applySuggestion = (type: 'title' | 'summary') => {
    const content = suggestions[type]
    if (content) {
      onSuggestion({ type, content })
    }
  }

  const acceptAllChildren = () => {
    if (onChildrenGenerated && childSuggestions.length > 0) {
      onChildrenGenerated(childSuggestions)
      setChildSuggestions([])
    }
  }

  const acceptChild = (index: number) => {
    if (onChildrenGenerated && childSuggestions[index]) {
      onChildrenGenerated([childSuggestions[index]])
      setChildSuggestions(prev => prev.filter((_, i) => i !== index))
    }
  }

  const editChild = (index: number, field: 'title' | 'summary', value: string) => {
    setChildSuggestions(prev =>
      prev.map((child, i) => (i === index ? { ...child, [field]: value } : child))
    )
  }

  return (
    <Card className={`p-4 ${cardBg} relative`}>
      {/* Header with dismiss button */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isChildrenMode ? (
            <TreePine className={`h-4 w-4 ${iconColor}`} />
          ) : (
            <Lightbulb className={`h-4 w-4 ${iconColor}`} />
          )}
          <Badge variant="secondary" className="text-xs">
            AI Assistant
          </Badge>
          <span className="text-muted-foreground text-sm">
            {isChildrenMode ? `Generate Children` : `for ${level}`}
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={onDismiss}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Main action button */}
        <Button
          onClick={() => generateSuggestions()}
          disabled={isLoading}
          className={`${buttonColor} w-auto px-6 text-white`}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : isChildrenMode ? (
            <TreePine className="mr-2 h-4 w-4" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          {isChildrenMode ? `Generate Children` : 'Generate Ideas'}
        </Button>

        {/* Custom prompt section */}
        <div className="space-y-2">
          <Textarea
            value={customPrompt}
            onChange={e => setCustomPrompt(e.target.value)}
            placeholder={
              isChildrenMode
                ? `Ask for specific ${childLevelName}s to generate...`
                : `Ask for specific help with your ${level}...`
            }
            className="bg-input text-sm"
            rows={2}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleCustomPrompt}
              disabled={isLoading || !customPrompt.trim()}
              size="sm"
              variant="outline"
              className="bg-input hover:bg-input/50"
            >
              <RefreshCw className="mr-1 h-3 w-3" />
              Ask AI
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Content Mode Suggestions */}
        {mode === 'content' && (suggestions.title || suggestions.summary) && (
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 text-sm font-medium">
              <Lightbulb className="h-4 w-4" />
              Suggestions:
            </h4>

            {suggestions.title && (
              <div className="bg-muted border-muted-foreground rounded-md border p-3">
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    Title
                  </Badge>
                  <Button
                    onClick={() => applySuggestion('title')}
                    size="sm"
                    variant="ghost"
                    className="h-auto px-2 py-1 text-xs hover:bg-blue-100"
                  >
                    Use This
                  </Button>
                </div>
                <p className="text-muted-foreground text-sm">{suggestions.title}</p>
              </div>
            )}

            {suggestions.summary && (
              <div className="bg-muted border-muted-foreground rounded-md border p-3">
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    Summary
                  </Badge>
                  <Button
                    onClick={() => applySuggestion('summary')}
                    size="sm"
                    variant="ghost"
                    className="h-auto px-2 py-1 text-xs hover:bg-blue-100"
                  >
                    Use This
                  </Button>
                </div>
                <p className="text-muted-foreground text-sm">{suggestions.summary}</p>
              </div>
            )}
          </div>
        )}

        {/* Children Mode Suggestions */}
        {mode === 'children' && childSuggestions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="flex items-center gap-2 text-sm font-medium">
                <TreePine className="h-4 w-4" />
                Generated Children:
              </h4>
              <Button
                onClick={acceptAllChildren}
                size="sm"
                className="bg-green-600 px-3 text-white hover:bg-green-700"
              >
                Accept All
              </Button>
            </div>

            <div className="space-y-3">
              {childSuggestions.map((child, index) => (
                <div
                  key={index}
                  className="bg-muted border-muted-foreground space-y-3 rounded-md border p-3"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {child.levelName} {index + 1}
                    </Badge>
                    <Button
                      onClick={() => acceptChild(index)}
                      size="sm"
                      variant="ghost"
                      className="h-auto px-2 py-1 text-xs hover:bg-green-100"
                    >
                      Accept
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium">Title:</label>
                      <Input
                        value={child.title}
                        onChange={e => editChild(index, 'title', e.target.value)}
                        className="text-sm"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium">Summary:</label>
                      <Textarea
                        value={child.summary}
                        onChange={e => editChild(index, 'summary', e.target.value)}
                        className="text-sm"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
