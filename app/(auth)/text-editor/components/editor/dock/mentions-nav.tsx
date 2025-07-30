'use client'

import { useState, useEffect } from 'react'
import type { Editor as TiptapEditor } from '@tiptap/react'
import { ChevronDown, ChevronRight, Calendar, Users, Hash } from 'lucide-react'
import { cn } from '@/lib/utils'

type MentionType = 'location' | 'event' | 'character'

interface MentionReference {
  id: string
  label: string
  type: MentionType
  paragraphText: string
  headingText?: string
  headingLevel?: number
  position: number // Position in document for ordering
}

interface MentionsNavProps {
  editor: TiptapEditor
  type: MentionType
}

// Function to extract ALL mentions of a specific type from the document
const extractMentionReferences = (editor: TiptapEditor, type: MentionType): MentionReference[] => {
  const mentions: MentionReference[] = []
  const doc = editor.getJSON()
  let position = 0
  let currentHeading = ''
  let currentHeadingLevel = 0

  const traverseNode = (node: any, paragraphText = '') => {
    position++
    
    // Track current heading context
    if (node.type === 'heading') {
      currentHeading = extractTextFromNode(node)
      currentHeadingLevel = node.attrs?.level || 1
    }

    // Build paragraph text as we traverse
    let currentParagraphText = paragraphText
    if (node.type === 'paragraph') {
      currentParagraphText = extractTextFromNode(node)
    }

    // Check if this is a mention node of the target type
    if (node.type === 'mention' || node.type === 'eventMention' || node.type === 'characterMention') {
      const mentionType = node.attrs?.type || 
        (node.type === 'eventMention' ? 'event' : 
         node.type === 'characterMention' ? 'character' : 'location')
      
      if (mentionType === type && node.attrs?.label) {
        mentions.push({
          id: `${node.attrs.id || node.attrs.label}-${position}`,
          label: node.attrs.label,
          type: mentionType as MentionType,
          paragraphText: currentParagraphText || 'No context available',
          headingText: currentHeading || 'No heading',
          headingLevel: currentHeadingLevel,
          position,
        })
      }
    }

    // Recursively check child nodes
    if (node.content && Array.isArray(node.content)) {
      node.content.forEach((childNode: any) => 
        traverseNode(childNode, currentParagraphText)
      )
    }
  }

  if (doc.content && Array.isArray(doc.content)) {
    doc.content.forEach((node: any) => traverseNode(node))
  }

  return mentions.sort((a, b) => a.position - b.position)
}

// Helper function to extract text from a node (including mentions)
const extractTextFromNode = (node: any): string => {
  if (!node) return ''
  
  if (node.type === 'text') {
    return node.text || ''
  }
  
  if (node.type === 'mention' || node.type === 'eventMention' || node.type === 'characterMention') {
    const label = node.attrs?.label || node.attrs?.id || 'mention'
    const type = node.attrs?.type || 
      (node.type === 'eventMention' ? 'event' : 
       node.type === 'characterMention' ? 'character' : 'location')
    const prefix = type === 'event' ? '!' : type === 'character' ? '&' : '@'
    return `${prefix}${label}`
  }
  
  if (node.content && Array.isArray(node.content)) {
    return node.content.map(extractTextFromNode).join('')
  }
  
  return ''
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
    case 'location': return 'text-green-700'
    case 'event': return 'text-blue-700'
    case 'character': return 'text-purple-700'
    default: return 'text-gray-700'
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

// Timeline view component
const TimelineView = ({ mentions, type, onMentionClick }: { 
  mentions: MentionReference[], 
  type: MentionType, 
  onMentionClick: (mention: MentionReference) => void 
}) => {
  const [expandedHeadings, setExpandedHeadings] = useState<Set<string>>(new Set())
  
  // Group mentions by heading
  const mentionsByHeading = mentions.reduce((acc, mention) => {
    const heading = mention.headingText || 'No heading'
    if (!acc[heading]) {
      acc[heading] = []
    }
    acc[heading].push(mention)
    return acc
  }, {} as Record<string, MentionReference[]>)

  const toggleHeading = (heading: string) => {
    const newExpanded = new Set(expandedHeadings)
    if (newExpanded.has(heading)) {
      newExpanded.delete(heading)
    } else {
      newExpanded.add(heading)
    }
    setExpandedHeadings(newExpanded)
  }

  return (
    <div className="space-y-1">
      {Object.entries(mentionsByHeading).map(([heading, headingMentions]) => {
        const isExpanded = expandedHeadings.has(heading)
        return (
          <div key={heading}>
            <button
              onClick={() => toggleHeading(heading)}
              className="flex items-center gap-2 w-full px-2 py-1 text-left text-sm hover:bg-accent rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
              )}
              <Hash className="w-3 h-3 text-muted-foreground" />
              <span className="font-medium truncate">{heading}</span>
              <span className="text-xs text-muted-foreground">({headingMentions.length})</span>
            </button>
            
            {isExpanded && (
              <div className="ml-6 space-y-1 mt-1">
                {headingMentions.map((mention, index) => (
                  <div
                    key={mention.id}
                    className="px-2 py-1 text-xs cursor-pointer hover:bg-accent rounded transition-colors"
                    onClick={() => onMentionClick(mention)}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <span className={cn("font-medium", getTypeColor(type))}>
                        {type === 'event' ? '!' : type === 'character' ? '&' : '@'}{mention.label}
                      </span>
                    </div>
                    <div className="text-muted-foreground line-clamp-1">
                      {mention.paragraphText}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// Entity view component
const EntityView = ({ mentions, type, onMentionClick }: { 
  mentions: MentionReference[], 
  type: MentionType, 
  onMentionClick: (mention: MentionReference) => void 
}) => {
  const [expandedEntities, setExpandedEntities] = useState<Set<string>>(new Set())
  
  // Group mentions by entity (label)
  const mentionsByEntity = mentions.reduce((acc, mention) => {
    if (!acc[mention.label]) {
      acc[mention.label] = []
    }
    acc[mention.label].push(mention)
    return acc
  }, {} as Record<string, MentionReference[]>)

  const toggleEntity = (entity: string) => {
    const newExpanded = new Set(expandedEntities)
    if (newExpanded.has(entity)) {
      newExpanded.delete(entity)
    } else {
      newExpanded.add(entity)
    }
    setExpandedEntities(newExpanded)
  }

  return (
    <div className="space-y-1">
      {Object.entries(mentionsByEntity).map(([entity, entityMentions]) => {
        const isExpanded = expandedEntities.has(entity)
        return (
          <div key={entity}>
            <button
              onClick={() => toggleEntity(entity)}
              className="flex items-center gap-2 w-full px-2 py-1 text-left text-sm hover:bg-accent rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
              )}
              <span className="text-sm">{getTypeIcon(type)}</span>
              <span className={cn("font-medium", getTypeColor(type))}>
                {type === 'event' ? '!' : type === 'character' ? '&' : '@'}{entity}
              </span>
              <span className="text-xs text-muted-foreground">({entityMentions.length})</span>
            </button>
            
            {isExpanded && (
              <div className="ml-6 space-y-1 mt-1">
                {entityMentions.map((mention, index) => (
                  <div
                    key={mention.id}
                    className="px-2 py-1 text-xs cursor-pointer hover:bg-accent rounded transition-colors"
                    onClick={() => onMentionClick(mention)}
                  >
                    <div className="text-muted-foreground mb-1 text-xs">
                      {mention.headingText}
                    </div>
                    <div className="text-muted-foreground line-clamp-1">
                      {mention.paragraphText}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export const MentionsNav = ({ editor, type }: MentionsNavProps) => {
  const [mentions, setMentions] = useState<MentionReference[]>([])
  const [viewMode, setViewMode] = useState<'timeline' | 'entity'>('timeline')

  useEffect(() => {
    const updateMentions = () => {
      const extractedMentions = extractMentionReferences(editor, type)
      setMentions(extractedMentions)
    }

    updateMentions()
    
    const handleUpdate = () => {
      updateMentions()
    }

    editor.on('update', handleUpdate)
    
    return () => {
      editor.off('update', handleUpdate)
    }
  }, [editor, type])

  const handleMentionClick = (mention: MentionReference) => {
    // Use TipTap's built-in position-based navigation
    // We need to find the exact position of this specific mention in the document
    const doc = editor.getJSON()
    let currentPosition = 0
    let targetPosition = -1
    
    const findMentionPosition = (node: any): boolean => {
      currentPosition++
      
      // Check if this is the mention we're looking for
      if ((node.type === 'mention' || node.type === 'eventMention' || node.type === 'characterMention') &&
          node.attrs?.label === mention.label &&
          currentPosition === mention.position) {
        targetPosition = currentPosition
        return true
      }
      
      // Recursively search child nodes
      if (node.content && Array.isArray(node.content)) {
        for (const childNode of node.content) {
          if (findMentionPosition(childNode)) {
            return true
          }
        }
      }
      
      return false
    }
    
    // Find the target position
    if (doc.content && Array.isArray(doc.content)) {
      for (const node of doc.content) {
        if (findMentionPosition(node)) {
          break
        }
      }
    }
    
    // If we found the position, try to navigate to it
    if (targetPosition > 0) {
      // Fallback to DOM-based approach with better targeting
      const editorElement = editor.view.dom
      const mentionElements = editorElement.querySelectorAll(`[data-type="${type}"][data-label="${mention.label}"]`)
      
      // Try to find the nth occurrence of this mention
      const allMentionsOfThisType = Array.from(editorElement.querySelectorAll(`[data-type="${type}"]`))
      const mentionsWithSameLabel = allMentionsOfThisType.filter(el => 
        el.getAttribute('data-label') === mention.label
      )
      
      // Calculate which occurrence this should be based on position
      const doc2 = editor.getJSON()
      let pos = 0
      let occurrenceIndex = 0
      
      const countOccurrences = (node: any): void => {
        pos++
        
        if ((node.type === 'mention' || node.type === 'eventMention' || node.type === 'characterMention') &&
            node.attrs?.label === mention.label) {
          if (pos === mention.position) {
            // This is our target occurrence
            return
          }
          if (pos < mention.position) {
            occurrenceIndex++
          }
        }
        
        if (node.content && Array.isArray(node.content)) {
          node.content.forEach(countOccurrences)
        }
      }
      
      if (doc2.content && Array.isArray(doc2.content)) {
        doc2.content.forEach(countOccurrences)
      }
      
      // Navigate to the specific occurrence
      const targetElement = mentionsWithSameLabel[occurrenceIndex]
      if (targetElement) {
        targetElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        })
        targetElement.classList.add('ring-2', 'ring-yellow-400')
        setTimeout(() => {
          targetElement.classList.remove('ring-2', 'ring-yellow-400')
        }, 2000)
      }
    }
  }

  if (mentions.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground text-sm">
        <div className="flex flex-col items-center gap-2">
          <span className="text-lg">{getTypeIcon(type)}</span>
          <p>No {getTypeLabel(type).toLowerCase()}s found</p>
          <p className="text-xs">
            Add {type === 'event' ? '!' : type === 'character' ? '&' : '@'}{getTypeLabel(type).toLowerCase()} mentions
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with view toggle */}
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <span className="text-sm">{getTypeIcon(type)}</span>
          <span>{getTypeLabel(type)}s ({mentions.length})</span>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('timeline')}
            className={cn(
              "p-1 rounded text-xs transition-colors",
              viewMode === 'timeline' 
                ? "bg-accent text-accent-foreground" 
                : "hover:bg-accent text-muted-foreground"
            )}
          >
            <Calendar className="w-3 h-3" />
          </button>
          <button
            onClick={() => setViewMode('entity')}
            className={cn(
              "p-1 rounded text-xs transition-colors",
              viewMode === 'entity' 
                ? "bg-accent text-accent-foreground" 
                : "hover:bg-accent text-muted-foreground"
            )}
          >
            <Users className="w-3 h-3" />
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2">
        {viewMode === 'timeline' ? (
          <TimelineView mentions={mentions} type={type} onMentionClick={handleMentionClick} />
        ) : (
          <EntityView mentions={mentions} type={type} onMentionClick={handleMentionClick} />
        )}
      </div>
    </div>
  )
}
