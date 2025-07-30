'use client'

import type { TableOfContentDataItem } from '@tiptap/extension-table-of-contents'

import { useState } from 'react'

import { ChevronDown, ChevronRight, Hash, Quote } from 'lucide-react'

import { cn } from '@/lib/utils'

interface OutlineItemProps {
  item: TableOfContentDataItem
  children?: OutlineNode[]
  onItemClick: (item: TableOfContentDataItem) => void
}

interface OutlineNode {
  item: TableOfContentDataItem
  children: OutlineNode[]
}

const OutlineItem = ({ item, onItemClick, children }: OutlineItemProps) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const hasChildren = children && children.length > 0
  const isHeading = item.node.type.name === 'heading'
  const isBlockquote = item.node.type.name === 'blockquote'

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onItemClick(item)
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  const getIndentLevel = () => {
    if (isBlockquote) return item.level + 1
    return item.level
  }

  const getIcon = () => {
    if (isBlockquote) return <Quote className="text-muted-foreground h-3 w-3" />
    return <Hash className="text-muted-foreground h-3 w-3" />
  }

  return (
    <div className="outline-item">
      <div
        className={cn(
          'hover:bg-accent flex cursor-pointer items-center gap-1 rounded-sm px-2 py-1 transition-colors',
          item.isActive && 'bg-accent font-medium',
          item.isScrolledOver && 'text-muted-foreground'
        )}
        style={{ paddingLeft: `${getIndentLevel() * 12 + 8}px` }}
        onClick={handleClick}
      >
        {hasChildren && (
          <button onClick={handleToggle} className="hover:bg-accent-foreground/10 rounded p-0">
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-3" />}

        {getIcon()}

        <span
          className={cn(
            'flex-1 truncate text-sm',
            isHeading && 'font-medium',
            isBlockquote && 'text-muted-foreground italic',
            item.isActive && 'text-foreground'
          )}
        >
          {item.textContent || 'Untitled'}
        </span>
      </div>

      {hasChildren && isExpanded && (
        <div className="outline-children">
          {children.map(child => (
            <OutlineItem key={child.item.id} item={child.item} onItemClick={onItemClick}>
              {child.children}
            </OutlineItem>
          ))}
        </div>
      )}
    </div>
  )
}

const buildOutlineTree = (items: TableOfContentDataItem[]): OutlineNode[] => {
  const tree: OutlineNode[] = []
  const stack: OutlineNode[] = []

  for (const item of items) {
    const node: OutlineNode = { item, children: [] }
    const isHeading = item.node.type.name === 'heading'
    const isBlockquote = item.node.type.name === 'blockquote'

    if (isBlockquote) {
      // Blockquotes should always be children of the most recent heading
      // Find the last heading in the stack to attach this blockquote to
      if (stack.length > 0) {
        stack[stack.length - 1].children.push(node)
      } else {
        // If no heading exists, add to root (shouldn't happen in normal usage)
        tree.push(node)
      }
    } else if (isHeading) {
      // Find the correct parent based on heading level
      while (stack.length > 0 && stack[stack.length - 1].item.level >= item.level) {
        stack.pop()
      }

      if (stack.length === 0) {
        tree.push(node)
      } else {
        stack[stack.length - 1].children.push(node)
      }

      // Add this heading to the stack so it can have children
      stack.push(node)
    }
  }

  return tree
}

export const Outline = ({ tocItems }: { tocItems: TableOfContentDataItem[] }) => {
  if (!tocItems || tocItems.length === 0) {
    return (
      <div className="text-muted-foreground p-4 text-center text-sm">
        Add headings to your document to see the outline.
      </div>
    )
  }

  const handleItemClick = (item: TableOfContentDataItem) => {
    // Scroll to the element
    const element = document.getElementById(item.id)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      })
    }
  }

  const outlineTree = buildOutlineTree(tocItems)

  return (
    <div className="outline-container space-y-1">
      {outlineTree.map(node => (
        <OutlineItem key={node.item.id} item={node.item} onItemClick={handleItemClick}>
          {node.children}
        </OutlineItem>
      ))}
    </div>
  )
}
