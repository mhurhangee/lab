// Centralized type definitions
export type NodeStatus = 'empty' | 'in-progress' | 'complete'

export interface FractalNode {
  id: string
  title: string
  summary: string
  status: NodeStatus
  levelName: string
  children: FractalNode[]
  metadata: {
    created: string
    modified: string
  }
}

export interface Fractal {
  title: string
  summary: string
  rootNode: FractalNode
  maxDepth: number
  maxSiblings: number
  metadata: {
    created: string
    modified: string
    version: string
  }
}

export interface AIContextNode {
  node: FractalNode
  depth: number
  relationship: 'self' | 'parent' | 'grandparent' | 'sibling' | 'cousin' | 'child'
  path: string[]
}

export interface FractalStats {
  totalNodes: number
  completeNodes: number
  inProgressNodes: number
  emptyNodes: number
  levelCounts: Record<string, number>
  maxDepth: number
  completionPercentage: number
}
