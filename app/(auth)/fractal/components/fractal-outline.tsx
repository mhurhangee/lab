'use client'

import { useState } from 'react'

import { ChevronDown, ChevronRight, FolderTree, Plus, Sparkles, Trash2, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EditableText } from '@/components/ui/editable-text'
import { Input } from '@/components/ui/input'

import { buildChildGenerationContext, buildSmartContext } from '../lib/context-builder'
import type { FractalNode, FractalProject, NodeStatus } from '../lib/fractal-structure'
import {
  addChildLevel,
  addSibling,
  cycleStatus,
  deleteNode,
  findNodeByPath,
  getAutoStatus,
  getStatusColor,
  handleGenerateChildren,
  updateNodeLevelName,
} from '../lib/fractal-structure'
import { AIAssistant } from './ai-assistant'

interface FractalOutlineProps {
  project: FractalProject
  onUpdate: (project: FractalProject) => void
}

export function FractalOutline({ project, onUpdate }: FractalOutlineProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['root']))
  const [showAI, setShowAI] = useState<string | null>(null)
  const [editingLevelName, setEditingLevelName] = useState<string | null>(null)
  const [newChildLevelName, setNewChildLevelName] = useState<string>('')
  const [showAddChild, setShowAddChild] = useState<string | null>(null)

  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedSections(newExpanded)
  }

  const updateNode = (nodePath: string[], updates: Partial<FractalNode>) => {
    const updatedProject = { ...project }

    function updateNodeRecursive(node: FractalNode, path: string[]): FractalNode {
      if (path.length === 0) {
        return {
          ...node,
          ...updates,
          metadata: {
            ...node.metadata,
            modified: new Date().toISOString(),
          },
        }
      }

      const [nextId, ...remainingPath] = path
      return {
        ...node,
        children: node.children.map(child =>
          child.id === nextId ? updateNodeRecursive(child, remainingPath) : child
        ),
      }
    }

    if (nodePath.length === 0) {
      // Updating root node
      updatedProject.rootNode = {
        ...updatedProject.rootNode,
        ...updates,
        metadata: {
          ...updatedProject.rootNode.metadata,
          modified: new Date().toISOString(),
        },
      }
    } else {
      updatedProject.rootNode = updateNodeRecursive(updatedProject.rootNode, nodePath)
    }

    // Update project metadata
    updatedProject.metadata.modified = new Date().toISOString()
    onUpdate(updatedProject)
  }

  const handleAddSibling = (nodePath: string[]) => {
    if (nodePath.length === 0) return // Can't add sibling to root

    const currentNode = findNodeByPath(project.rootNode, nodePath)
    if (currentNode) {
      const updatedProject = addSibling(project, nodePath, currentNode.levelName)
      onUpdate(updatedProject)
    }
  }

  const handleAddChild = (nodePath: string[], childLevelName: string) => {
    const updatedProject = addChildLevel(project, nodePath, childLevelName)
    onUpdate(updatedProject)
    setShowAddChild(null)
    setNewChildLevelName('')
  }

  const handleDeleteNode = (nodePath: string[]) => {
    if (nodePath.length === 0) return // Can't delete root

    if (confirm('Are you sure you want to delete this node and all its children?')) {
      const updatedProject = deleteNode(project, nodePath)
      onUpdate(updatedProject)
    }
  }

  const handleUpdateLevelName = (nodePath: string[], newLevelName: string) => {
    const updatedProject = updateNodeLevelName(project, nodePath, newLevelName)
    onUpdate(updatedProject)
    setEditingLevelName(null)
  }

  const handleGenerateChildrenWrapper = (
    nodePath: string[],
    children: Array<{ title: string; summary: string; levelName: string }>
  ) => {
    const updatedProject = handleGenerateChildren(project, nodePath, children)
    onUpdate(updatedProject)
  }

  return (
    <div className="space-y-4">
      <NodeSection
        node={project.rootNode}
        nodePath={[]}
        project={project}
        expandedSections={expandedSections}
        toggleExpanded={toggleExpanded}
        onUpdateNode={updateNode}
        onAddSibling={handleAddSibling}
        onAddChild={handleAddChild}
        onDeleteNode={handleDeleteNode}
        onUpdateLevelName={handleUpdateLevelName}
        onGenerateChildren={handleGenerateChildrenWrapper}
        showAI={showAI}
        setShowAI={setShowAI}
        editingLevelName={editingLevelName}
        setEditingLevelName={setEditingLevelName}
        newChildLevelName={newChildLevelName}
        setNewChildLevelName={setNewChildLevelName}
        showAddChild={showAddChild}
        setShowAddChild={setShowAddChild}
        isRoot={true}
      />
    </div>
  )
}

interface NodeSectionProps {
  node: FractalNode
  nodePath: string[]
  project: FractalProject
  expandedSections: Set<string>
  toggleExpanded: (nodeId: string) => void
  onUpdateNode: (nodePath: string[], updates: Partial<FractalNode>) => void
  onAddSibling: (nodePath: string[]) => void
  onAddChild: (nodePath: string[], childLevelName: string) => void
  onDeleteNode: (nodePath: string[]) => void
  onUpdateLevelName: (nodePath: string[], newLevelName: string) => void
  onGenerateChildren: (
    nodePath: string[],
    children: Array<{ title: string; summary: string; levelName: string }>
  ) => void
  showAI: string | null
  setShowAI: (id: string | null) => void
  editingLevelName: string | null
  setEditingLevelName: (id: string | null) => void
  newChildLevelName: string
  setNewChildLevelName: (name: string) => void
  showAddChild: string | null
  setShowAddChild: (id: string | null) => void
  isRoot?: boolean
}

function NodeSection({
  node,
  nodePath,
  project,
  expandedSections,
  toggleExpanded,
  onUpdateNode,
  onAddSibling,
  onAddChild,
  onDeleteNode,
  onUpdateLevelName,
  onGenerateChildren,
  showAI,
  setShowAI,
  editingLevelName,
  setEditingLevelName,
  newChildLevelName,
  setNewChildLevelName,
  showAddChild,
  setShowAddChild,
  isRoot = false,
}: NodeSectionProps) {
  const aiId = `ai-${node.id}`
  const addChildId = `add-child-${node.id}`

  // Local state for editing level name to prevent focus loss
  const [localLevelName, setLocalLevelName] = useState(node.levelName)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [localTitle, setLocalTitle] = useState(node.title)

  const updateTitle = (title: string) => {
    const status = getAutoStatus(
      title,
      node.summary,
      node.status === 'complete' ? 'complete' : undefined
    )
    onUpdateNode(nodePath, { title, status })
  }

  const updateSummary = (summary: string) => {
    const status = getAutoStatus(
      node.title,
      summary,
      node.status === 'complete' ? 'complete' : undefined
    )
    onUpdateNode(nodePath, { summary, status })
  }

  const updateStatus = (status: NodeStatus) => {
    onUpdateNode(nodePath, { status })
  }

  const handleLevelNameEdit = () => {
    setLocalLevelName(node.levelName)
    setEditingLevelName(node.id)
  }

  const handleLevelNameSave = () => {
    if (localLevelName.trim() && localLevelName !== node.levelName) {
      onUpdateLevelName(nodePath, localLevelName.trim())
    }
    setEditingLevelName(null)
  }

  const handleLevelNameCancel = () => {
    setLocalLevelName(node.levelName)
    setEditingLevelName(null)
  }

  const handleTitleEdit = () => {
    setLocalTitle(node.title)
    setIsEditingTitle(true)
  }

  const handleTitleSave = () => {
    if (localTitle !== node.title) {
      updateTitle(localTitle)
    }
    setIsEditingTitle(false)
  }

  const handleTitleCancel = () => {
    setLocalTitle(node.title)
    setIsEditingTitle(false)
  }

  return (
    <div className="space-y-3">
      <div className="hover:bg-muted/50 flex items-center gap-3 rounded p-2 transition-colors">
        {/* Expand/Collapse Button */}
        <Button variant="ghost" size="icon" onClick={() => toggleExpanded(node.id)}>
          {expandedSections.has(node.id) ? (
            <ChevronDown className="text-muted-foreground h-5 w-5" />
          ) : (
            <ChevronRight className="text-muted-foreground h-5 w-5" />
          )}
        </Button>

        {/* Icon */}
        <FolderTree className="h-5 w-5 flex-shrink-0" />

        {/* Editable Level Name Badge */}
        {editingLevelName === node.id ? (
          <Input
            value={localLevelName}
            onChange={e => setLocalLevelName(e.target.value)}
            onBlur={handleLevelNameSave}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleLevelNameSave()
              } else if (e.key === 'Escape') {
                handleLevelNameCancel()
              }
            }}
            className="h-6 w-24 flex-shrink-0 px-2 text-xs"
            autoFocus
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <Badge
            variant="secondary"
            className="flex-shrink-0 cursor-pointer text-sm"
            onClick={e => {
              e.stopPropagation()
              handleLevelNameEdit()
            }}
            title="Click to rename level"
          >
            {node.levelName}
          </Badge>
        )}

        {/* Status Indicator */}
        <button
          onClick={e => {
            e.stopPropagation()
            updateStatus(cycleStatus(node.status))
          }}
          className={`h-3 w-3 rounded-full ${getStatusColor(node.status)} flex-shrink-0 transition-transform hover:scale-110`}
          title={`Status: ${node.status} (click to change)`}
        />

        {/* Inline Title */}
        <div className="min-w-0 flex-1">
          {isEditingTitle ? (
            <Input
              value={localTitle}
              onChange={e => setLocalTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleTitleSave()
                } else if (e.key === 'Escape') {
                  handleTitleCancel()
                }
              }}
              className="h-8 text-sm font-semibold"
              autoFocus
              placeholder={`Enter ${node.levelName.toLowerCase()} title...`}
            />
          ) : (
            <div
              onClick={handleTitleEdit}
              className="flex min-h-[32px] cursor-text items-center rounded px-3 py-1 transition-all hover:bg-white hover:shadow-sm"
              title="Click to edit title"
            >
              <span
                className={`truncate text-sm font-semibold ${!node.title ? 'text-muted-foreground' : 'text-foreground'}`}
              >
                {node.title || `Enter ${node.levelName.toLowerCase()} title...`}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {!isRoot && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={e => {
                e.stopPropagation()
                onAddSibling(nodePath)
              }}
              className="flex-shrink-0 opacity-60 hover:opacity-100"
              title="Add sibling"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={e => {
                e.stopPropagation()
                onDeleteNode(nodePath)
              }}
              className="hover:text-destructive flex-shrink-0 opacity-60 hover:opacity-100"
              title="Delete node"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={e => {
            e.stopPropagation()
            setShowAddChild(showAddChild === addChildId ? null : addChildId)
          }}
          className="flex-shrink-0 opacity-60 hover:opacity-100"
          title="Add child"
        >
          <FolderTree className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={e => {
            e.stopPropagation()
            setShowAI(showAI === aiId ? null : aiId)
          }}
          className="flex-shrink-0 opacity-60 hover:opacity-100"
          title="AI content suggestions"
        >
          <Sparkles className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={e => {
            e.stopPropagation()
            setShowAI(showAI === `${aiId}-children` ? null : `${aiId}-children`)
          }}
          className="flex-shrink-0 opacity-60 hover:opacity-100"
          title="Generate children with AI"
        >
          <Plus className="h-4 w-4" />
          <Sparkles className="h-3 w-3" />
        </Button>
      </div>

      {expandedSections.has(node.id) && (
        <div className="ml-8 space-y-4">
          {/* Only Summary - Title is now inline above */}
          <EditableText
            value={node.summary}
            onChange={updateSummary}
            placeholder={`Describe this ${node.levelName.toLowerCase()}...`}
            multiline
          />

          {/* Add Child Level Input */}
          {showAddChild === addChildId && (
            <div className="bg-muted border-muted-foreground flex items-center gap-2 rounded border p-3">
              <Input
                value={newChildLevelName}
                onChange={e => setNewChildLevelName(e.target.value)}
                placeholder="Enter child level name (e.g., Feature, Task, Component)"
                className="flex-1"
                onKeyDown={e => {
                  if (e.key === 'Enter' && newChildLevelName.trim()) {
                    onAddChild(nodePath, newChildLevelName.trim())
                  } else if (e.key === 'Escape') {
                    setShowAddChild(null)
                    setNewChildLevelName('')
                  }
                }}
                autoFocus
              />
              <Button
                onClick={() => {
                  if (newChildLevelName.trim()) {
                    onAddChild(nodePath, newChildLevelName.trim())
                  }
                }}
                disabled={!newChildLevelName.trim()}
                size="sm"
              >
                Add
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddChild(null)
                  setNewChildLevelName('')
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* AI Assistants */}
          {showAI === aiId && (
            <AIAssistant
              context={buildSmartContext(project, nodePath)}
              level={node.levelName}
              mode="content"
              onSuggestion={suggestion => {
                if (suggestion.type === 'title') {
                  updateTitle(suggestion.content)
                } else if (suggestion.type === 'summary') {
                  updateSummary(suggestion.content)
                }
              }}
              onDismiss={() => setShowAI(null)}
            />
          )}

          {showAI === `${aiId}-children` && (
            <AIAssistant
              context={buildChildGenerationContext(project, nodePath, 'Child')}
              level={node.levelName}
              mode="children"
              childLevelName="Child"
              onChildrenGenerated={children => {
                onGenerateChildren(nodePath, children)
              }}
              onDismiss={() => setShowAI(null)}
              onSuggestion={suggestion => {
                if (suggestion.type === 'title') {
                  updateTitle(suggestion.content)
                } else if (suggestion.type === 'summary') {
                  updateSummary(suggestion.content)
                }
              }}
            />
          )}

          {/* Children */}
          {node.children.length > 0 && (
            <div className="ml-4 space-y-3">
              {node.children.map(child => (
                <NodeSection
                  key={child.id}
                  node={child}
                  nodePath={[...nodePath, child.id]}
                  project={project}
                  expandedSections={expandedSections}
                  toggleExpanded={toggleExpanded}
                  onUpdateNode={onUpdateNode}
                  onAddSibling={onAddSibling}
                  onAddChild={onAddChild}
                  onDeleteNode={onDeleteNode}
                  onUpdateLevelName={onUpdateLevelName}
                  onGenerateChildren={onGenerateChildren}
                  showAI={showAI}
                  setShowAI={setShowAI}
                  editingLevelName={editingLevelName}
                  setEditingLevelName={setEditingLevelName}
                  newChildLevelName={newChildLevelName}
                  setNewChildLevelName={setNewChildLevelName}
                  showAddChild={showAddChild}
                  setShowAddChild={setShowAddChild}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
