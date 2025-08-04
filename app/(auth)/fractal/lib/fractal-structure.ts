import { generateId } from '@/lib/id'

import { APP_CONFIG, STATUS_CONFIG } from './constants'
import type { Fractal, FractalNode, FractalStats, NodeStatus } from './types'

// Status management functions
export function getAutoStatus(
  title: string,
  summary: string,
  manualStatus?: NodeStatus
): NodeStatus {
  if (manualStatus === STATUS_CONFIG.COMPLETE.value) return STATUS_CONFIG.COMPLETE.value
  if (!title.trim() && !summary.trim()) return STATUS_CONFIG.EMPTY.value
  return STATUS_CONFIG.IN_PROGRESS.value
}

export function cycleStatus(currentStatus: NodeStatus): NodeStatus {
  switch (currentStatus) {
    case STATUS_CONFIG.EMPTY.value:
      return STATUS_CONFIG.IN_PROGRESS.value
    case STATUS_CONFIG.IN_PROGRESS.value:
      return STATUS_CONFIG.COMPLETE.value
    case STATUS_CONFIG.COMPLETE.value:
      return STATUS_CONFIG.EMPTY.value
    default:
      return STATUS_CONFIG.EMPTY.value
  }
}

export function getStatusColor(status: NodeStatus): string {
  return (
    STATUS_CONFIG[status.toUpperCase().replace('-', '_') as keyof typeof STATUS_CONFIG]?.color ||
    'bg-gray-400'
  )
}

// Node creation functions
export function createEmptyNode(levelName: string, id?: string): FractalNode {
  const now = new Date().toISOString()
  return {
    id: id || generateNodeId(),
    title: '',
    summary: '',
    status: STATUS_CONFIG.EMPTY.value,
    levelName,
    children: [],
    metadata: {
      created: now,
      modified: now,
    },
  }
}

function generateNodeId(): string {
  return `node_${generateId()}`
}

// Project creation functions
export function createEmptyFractal(): Fractal {
  const now = new Date().toISOString()
  return {
    title: '',
    summary: '',
    rootNode: createEmptyNode('Project', 'root'),
    maxDepth: APP_CONFIG.DEFAULT_MAX_DEPTH,
    maxSiblings: APP_CONFIG.DEFAULT_MAX_SIBLINGS,
    metadata: {
      created: now,
      modified: now,
      version: APP_CONFIG.VERSION,
    },
  }
}

// Fractal management functions with better error handling
export function addSibling(
  fractal: Fractal,
  nodePath: string[],
  siblingLevelName: string
): Fractal {
  try {
    const newFractal = structuredClone(fractal)
    const parentPath = nodePath.slice(0, -1)
    const parent = findNodeByPath(newFractal.rootNode, parentPath)

    if (parent && parent.children.length < fractal.maxSiblings) {
      const newNode = createEmptyNode(siblingLevelName)
      parent.children.push(newNode)
      updateFractalModified(newFractal)
    }

    return newFractal
  } catch (error) {
    console.error('Error adding sibling:', error)
    return fractal
  }
}

export function addChildLevel(
  fractal: Fractal,
  nodePath: string[],
  childLevelName: string
): Fractal {
  try {
    const newFractal = structuredClone(fractal)
    const node = findNodeByPath(newFractal.rootNode, nodePath)

    if (node && getNodeDepth(nodePath) < fractal.maxDepth) {
      const newChild = createEmptyNode(childLevelName)
      node.children.push(newChild)
      updateFractalModified(newFractal)
    }

    return newFractal
  } catch (error) {
    console.error('Error adding child:', error)
    return fractal
  }
}

export function deleteNode(fractal: Fractal, nodePath: string[]): Fractal {
  if (nodePath.length === 0) return fractal // Can't delete root

  try {
    const newFractal = structuredClone(fractal)
    const parentPath = nodePath.slice(0, -1)
    const nodeId = nodePath[nodePath.length - 1]
    const parent = findNodeByPath(newFractal.rootNode, parentPath)

    if (parent) {
      parent.children = parent.children.filter(child => child.id !== nodeId)
      updateFractalModified(newFractal)
    }

    return newFractal
  } catch (error) {
    console.error('Error deleting node:', error)
    return fractal
  }
}

export function updateNodeLevelName(
  fractal: Fractal,
  nodePath: string[],
  newLevelName: string
): Fractal {
  try {
    const newFractal = structuredClone(fractal)
    const node = findNodeByPath(newFractal.rootNode, nodePath)

    if (node) {
      node.levelName = newLevelName.trim()
      node.metadata.modified = new Date().toISOString()
      updateFractalModified(newFractal)
    }

    return newFractal
  } catch (error) {
    console.error('Error updating level name:', error)
    return fractal
  }
}

// Utility functions
export function findNodeByPath(rootNode: FractalNode, path: string[]): FractalNode | null {
  if (path.length === 0) return rootNode

  let current = rootNode
  for (const nodeId of path) {
    const child = current.children.find(c => c.id === nodeId)
    if (!child) return null
    current = child
  }

  return current
}

function getNodeDepth(path: string[]): number {
  return path.length
}

// Statistics calculation
export function calculateFractalStats(fractal: Fractal): FractalStats {
  const stats: FractalStats = {
    totalNodes: 0,
    completeNodes: 0,
    inProgressNodes: 0,
    emptyNodes: 0,
    levelCounts: {},
    maxDepth: 0,
    completionPercentage: 0,
  }

  function traverse(node: FractalNode, depth: number) {
    stats.totalNodes++
    stats.maxDepth = Math.max(stats.maxDepth, depth)

    // Count by status
    switch (node.status) {
      case STATUS_CONFIG.COMPLETE.value:
        stats.completeNodes++
        break
      case STATUS_CONFIG.IN_PROGRESS.value:
        stats.inProgressNodes++
        break
      case STATUS_CONFIG.EMPTY.value:
        stats.emptyNodes++
        break
    }

    // Count by level
    stats.levelCounts[node.levelName] = (stats.levelCounts[node.levelName] || 0) + 1

    // Traverse children
    node.children.forEach(child => traverse(child, depth + 1))
  }

  traverse(fractal.rootNode, 0)

  stats.completionPercentage =
    stats.totalNodes > 0 ? Math.round((stats.completeNodes / stats.totalNodes) * 100) : 0

  return stats
}

// Child generation helper
export function handleGenerateChildren(
  fractal: Fractal,
  nodePath: string[],
  children: Array<{ title: string; summary: string; levelName: string }>
): Fractal {
  let updatedFractal = structuredClone(fractal)

  children.forEach(child => {
    updatedFractal = addChildLevel(updatedFractal, nodePath, child.levelName)

    // Find the newly added child and update its content
    const parentNode = findNodeByPath(updatedFractal.rootNode, nodePath)
    if (parentNode && parentNode.children.length > 0) {
      const newChild = parentNode.children[parentNode.children.length - 1]
      newChild.title = child.title
      newChild.summary = child.summary
      newChild.status = getAutoStatus(child.title, child.summary)
      newChild.metadata.modified = new Date().toISOString()
    }
  })

  return updatedFractal
}

// Serialization functions with better error handling
export function serializeFractal(fractal: Fractal): string {
  try {
    const updatedFractal = structuredClone(fractal)
    updateFractalModified(updatedFractal)
    return JSON.stringify(updatedFractal, null, 2)
  } catch (error) {
    console.error('Error serializing project:', error)
    throw new Error('Failed to serialize project')
  }
}

// Export functions
export function exportToMarkdown(fractal: Fractal): string {
  let markdown = `# ${fractal.title}\n\n`
  markdown += `${fractal.summary}\n\n`

  function nodeToMarkdown(node: FractalNode, depth = 1): string {
    let result = ''
    const headerLevel = '#'.repeat(Math.min(depth, 6))

    if (node.id !== 'root') {
      result += `${headerLevel} ${node.title || `Untitled ${node.levelName}`}\n\n`
      if (node.summary) {
        result += `${node.summary}\n\n`
      }
    }

    for (const child of node.children) {
      result += nodeToMarkdown(child, depth + 1)
    }

    return result
  }

  markdown += nodeToMarkdown(fractal.rootNode)
  return markdown
}

// Helper functions
function updateFractalModified(fractal: Fractal): void {
  fractal.metadata.modified = new Date().toISOString()
}
