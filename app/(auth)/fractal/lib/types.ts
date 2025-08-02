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

export interface FractalProject {
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

export interface ProjectTemplate {
  name: string
  description: string
  levels: string[]
  icon: string
  color: string
  generator: () => FractalProject
}

export interface AIContextNode {
  node: FractalNode
  depth: number
  relationship: 'self' | 'parent' | 'grandparent' | 'sibling' | 'cousin' | 'child'
  path: string[]
}

export interface AIGenerationRequest {
  context: string
  level: string
  customPrompt?: string
}

export interface AIContentSuggestion {
  title: string
  summary: string
}

export interface AIChildSuggestion {
  title: string
  summary: string
  levelName: string
}

export interface ProjectStats {
  totalNodes: number
  completeNodes: number
  inProgressNodes: number
  emptyNodes: number
  levelCounts: Record<string, number>
  maxDepth: number
  completionPercentage: number
}
