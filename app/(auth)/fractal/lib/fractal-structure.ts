import { APP_CONFIG, STATUS_CONFIG } from './constants'
import type { FractalNode, FractalProject, NodeStatus, ProjectStats } from './types'

// Re-export types for backward compatibility
export type { FractalNode, FractalProject, NodeStatus }

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

export function generateNodeId(): string {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Project creation functions
export function createEmptyFractal(): FractalProject {
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

export function createBookPlannerProject(): FractalProject {
  const project = createEmptyFractal()
  project.rootNode.levelName = 'Series'

  // Create initial book structure
  const book1 = createEmptyNode('Book')
  book1.children = Array(3)
    .fill(null)
    .map(() => {
      const act = createEmptyNode('Act')
      act.children = Array(3)
        .fill(null)
        .map(() => {
          const sequence = createEmptyNode('Sequence')
          sequence.children = Array(3)
            .fill(null)
            .map(() => {
              const chapter = createEmptyNode('Chapter')
              chapter.children = Array(3)
                .fill(null)
                .map(() => createEmptyNode('Scene'))
              return chapter
            })
          return sequence
        })
      return act
    })

  project.rootNode.children = [book1]
  return project
}

// Project management functions with better error handling
export function addSibling(
  project: FractalProject,
  nodePath: string[],
  siblingLevelName: string
): FractalProject {
  try {
    const newProject = structuredClone(project)
    const parentPath = nodePath.slice(0, -1)
    const parent = findNodeByPath(newProject.rootNode, parentPath)

    if (parent && parent.children.length < project.maxSiblings) {
      const newNode = createEmptyNode(siblingLevelName)
      parent.children.push(newNode)
      updateProjectModified(newProject)
    }

    return newProject
  } catch (error) {
    console.error('Error adding sibling:', error)
    return project
  }
}

export function addChildLevel(
  project: FractalProject,
  nodePath: string[],
  childLevelName: string
): FractalProject {
  try {
    const newProject = structuredClone(project)
    const node = findNodeByPath(newProject.rootNode, nodePath)

    if (node && getNodeDepth(nodePath) < project.maxDepth) {
      const newChild = createEmptyNode(childLevelName)
      node.children.push(newChild)
      updateProjectModified(newProject)
    }

    return newProject
  } catch (error) {
    console.error('Error adding child:', error)
    return project
  }
}

export function deleteNode(project: FractalProject, nodePath: string[]): FractalProject {
  if (nodePath.length === 0) return project // Can't delete root

  try {
    const newProject = structuredClone(project)
    const parentPath = nodePath.slice(0, -1)
    const nodeId = nodePath[nodePath.length - 1]
    const parent = findNodeByPath(newProject.rootNode, parentPath)

    if (parent) {
      parent.children = parent.children.filter(child => child.id !== nodeId)
      updateProjectModified(newProject)
    }

    return newProject
  } catch (error) {
    console.error('Error deleting node:', error)
    return project
  }
}

export function updateNodeLevelName(
  project: FractalProject,
  nodePath: string[],
  newLevelName: string
): FractalProject {
  try {
    const newProject = structuredClone(project)
    const node = findNodeByPath(newProject.rootNode, nodePath)

    if (node) {
      node.levelName = newLevelName.trim()
      node.metadata.modified = new Date().toISOString()
      updateProjectModified(newProject)
    }

    return newProject
  } catch (error) {
    console.error('Error updating level name:', error)
    return project
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

export function getNodeDepth(path: string[]): number {
  return path.length
}

export function getNodePath(rootNode: FractalNode, targetId: string): string[] | null {
  function search(node: FractalNode, currentPath: string[]): string[] | null {
    if (node.id === targetId) return currentPath

    for (const child of node.children) {
      const result = search(child, [...currentPath, child.id])
      if (result) return result
    }

    return null
  }

  return search(rootNode, [])
}

// Statistics calculation
export function calculateProjectStats(project: FractalProject): ProjectStats {
  const stats: ProjectStats = {
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

  traverse(project.rootNode, 0)

  stats.completionPercentage =
    stats.totalNodes > 0 ? Math.round((stats.completeNodes / stats.totalNodes) * 100) : 0

  return stats
}

// Child generation helper
export function handleGenerateChildren(
  project: FractalProject,
  nodePath: string[],
  children: Array<{ title: string; summary: string; levelName: string }>
): FractalProject {
  let updatedProject = structuredClone(project)

  children.forEach(child => {
    updatedProject = addChildLevel(updatedProject, nodePath, child.levelName)

    // Find the newly added child and update its content
    const parentNode = findNodeByPath(updatedProject.rootNode, nodePath)
    if (parentNode && parentNode.children.length > 0) {
      const newChild = parentNode.children[parentNode.children.length - 1]
      newChild.title = child.title
      newChild.summary = child.summary
      newChild.status = getAutoStatus(child.title, child.summary)
      newChild.metadata.modified = new Date().toISOString()
    }
  })

  return updatedProject
}

// Serialization functions with better error handling
export function serializeProject(project: FractalProject): string {
  try {
    const updatedProject = structuredClone(project)
    updateProjectModified(updatedProject)
    return JSON.stringify(updatedProject, null, 2)
  } catch (error) {
    console.error('Error serializing project:', error)
    throw new Error('Failed to serialize project')
  }
}

export function deserializeProject(jsonString: string): FractalProject {
  try {
    const parsed = JSON.parse(jsonString)

    // Validate basic structure
    if (!parsed.rootNode || typeof parsed.title !== 'string') {
      throw new Error('Invalid project format')
    }

    // Add default status and metadata if missing (backward compatibility)
    const addDefaults = (node: FractalNode): FractalNode => {
      const now = new Date().toISOString()
      return {
        ...node,
        status: node.status || getAutoStatus(node.title || '', node.summary || ''),
        metadata: {
          created: node.metadata?.created || now,
          modified: node.metadata?.modified || now,
        },
        children: Array.isArray(node.children) ? node.children.map(addDefaults) : [],
      }
    }

    return {
      ...parsed,
      rootNode: addDefaults(parsed.rootNode),
      maxDepth: parsed.maxDepth || APP_CONFIG.DEFAULT_MAX_DEPTH,
      maxSiblings: parsed.maxSiblings || APP_CONFIG.DEFAULT_MAX_SIBLINGS,
      metadata: {
        created: parsed.metadata?.created || new Date().toISOString(),
        modified: new Date().toISOString(),
        version: parsed.metadata?.version || APP_CONFIG.VERSION,
      },
    } as FractalProject
  } catch (error) {
    console.error('Error deserializing project:', error)
    throw new Error(
      `Failed to parse project: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

// Export functions
export function exportToMarkdown(project: FractalProject): string {
  let markdown = `# ${project.title}\n\n`
  markdown += `${project.summary}\n\n`

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

  markdown += nodeToMarkdown(project.rootNode)
  return markdown
}

// Project templates
export const PROJECT_TEMPLATES: Record<string, () => FractalProject> = {
  'Book Series': createBookPlannerProject,
  'Software Project': () => {
    const project = createEmptyFractal()
    project.rootNode.levelName = 'Project'

    const frontendModule = createEmptyNode('Frontend Module')
    frontendModule.children = [
      createEmptyNode('Component'),
      createEmptyNode('Page'),
      createEmptyNode('Hook'),
    ]

    const backendModule = createEmptyNode('Backend Module')
    backendModule.children = [
      createEmptyNode('API Endpoint'),
      createEmptyNode('Database Model'),
      createEmptyNode('Service'),
    ]

    project.rootNode.children = [frontendModule, backendModule]
    return project
  },
  'Research Project': () => {
    const project = createEmptyFractal()
    project.rootNode.levelName = 'Research'
    return project
  },
  'Business Plan': () => {
    const project = createEmptyFractal()
    project.rootNode.levelName = 'Business'
    return project
  },
  'Empty Project': createEmptyFractal,
}

// Helper functions
function updateProjectModified(project: FractalProject): void {
  project.metadata.modified = new Date().toISOString()
}
