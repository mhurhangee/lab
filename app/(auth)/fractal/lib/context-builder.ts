import { APP_CONFIG } from './constants'
import type { AIContextNode, Fractal, FractalNode } from './types'

/**
 * Enhanced context builder that creates rich, hierarchical context
 * for AI assistance by analyzing relationships between nodes
 */
class ContextBuilder {
  private fractal: Fractal
  private targetPath: string[]
  private contextNodes: AIContextNode[] = []

  constructor(fractal: Fractal, targetPath: string[]) {
    this.fractal = fractal
    this.targetPath = targetPath
    this.buildContextNodes()
  }

  /**
   * Build the main context string for AI
   */
  public buildContext(): string {
    const sections = [
      this.buildFractalHeader(),
      this.buildHierarchicalContext(),
      this.buildRelationalContext(),
      this.buildStructuralContext(),
    ].filter(Boolean)

    const context = sections.join('\n\n')

    // Truncate if too long
    if (context.length > APP_CONFIG.MAX_CONTEXT_LENGTH) {
      return (
        context.substring(0, APP_CONFIG.MAX_CONTEXT_LENGTH) + '\n\n[Context truncated for length]'
      )
    }

    return context
  }

  /**
   * Build context specifically for child generation
   */
  public buildChildGenerationContext(childLevelName: string): string {
    const baseContext = this.buildContext()
    const targetNode = this.findNodeByPath(this.fractal.rootNode, this.targetPath)

    if (!targetNode) return baseContext

    const childContext = [
      baseContext,
      `\n=== CHILD GENERATION REQUEST ===`,
      `Generate children of type "${childLevelName}" for: ${targetNode.levelName} "${targetNode.title}"`,
      `Parent Summary: ${targetNode.summary}`,
      this.buildExistingChildrenContext(targetNode),
      this.buildSiblingPatternsContext(),
    ]
      .filter(Boolean)
      .join('\n\n')

    return childContext
  }

  private buildContextNodes(): void {
    const targetNode = this.findNodeByPath(this.fractal.rootNode, this.targetPath)
    if (!targetNode) return

    // Build hierarchical path
    this.addHierarchicalNodes()

    // Add siblings at each level
    this.addSiblingNodes()

    // Add children of target
    this.addChildrenNodes(targetNode)

    // Add cousins (siblings of parents)
    this.addCousinNodes()
  }

  private addHierarchicalNodes(): void {
    let currentNode = this.fractal.rootNode
    const pathNodes: AIContextNode[] = [
      {
        node: currentNode,
        depth: 0,
        relationship: this.targetPath.length === 0 ? 'self' : 'parent',
        path: [],
      },
    ]

    // Walk down the path
    for (let i = 0; i < this.targetPath.length; i++) {
      const nodeId = this.targetPath[i]
      const child = currentNode.children.find(c => c.id === nodeId)
      if (!child) break

      const relationship =
        i === this.targetPath.length - 1
          ? 'self'
          : i === this.targetPath.length - 2
            ? 'parent'
            : 'grandparent'

      pathNodes.push({
        node: child,
        depth: i + 1,
        relationship,
        path: this.targetPath.slice(0, i + 1),
      })

      currentNode = child
    }

    this.contextNodes.push(...pathNodes)
  }

  private addSiblingNodes(): void {
    if (this.targetPath.length === 0) return // Root has no siblings

    const parentPath = this.targetPath.slice(0, -1)
    const parentNode = this.findNodeByPath(this.fractal.rootNode, parentPath)
    const targetId = this.targetPath[this.targetPath.length - 1]

    if (parentNode) {
      const siblings = parentNode.children
        .filter(child => child.id !== targetId)
        .map(sibling => ({
          node: sibling,
          depth: this.targetPath.length,
          relationship: 'sibling' as const,
          path: [...parentPath, sibling.id],
        }))

      this.contextNodes.push(...siblings)
    }
  }

  private addChildrenNodes(targetNode: FractalNode): void {
    const children = targetNode.children.map(child => ({
      node: child,
      depth: this.targetPath.length + 1,
      relationship: 'child' as const,
      path: [...this.targetPath, child.id],
    }))

    this.contextNodes.push(...children)
  }

  private addCousinNodes(): void {
    if (this.targetPath.length < 2) return // Need grandparent for cousins

    const grandparentPath = this.targetPath.slice(0, -2)
    const parentId = this.targetPath[this.targetPath.length - 2]
    const grandparentNode = this.findNodeByPath(this.fractal.rootNode, grandparentPath)

    if (grandparentNode) {
      const uncles = grandparentNode.children.filter(child => child.id !== parentId)

      for (const uncle of uncles) {
        const cousins = uncle.children.map(cousin => ({
          node: cousin,
          depth: this.targetPath.length,
          relationship: 'cousin' as const,
          path: [...grandparentPath, uncle.id, cousin.id],
        }))

        this.contextNodes.push(...cousins.slice(0, 3)) // Limit cousins
      }
    }
  }

  private buildFractalHeader(): string {
    return [
      `FRACTAL: "${this.fractal.title}"`,
      `Fractal Summary: ${this.fractal.summary}`,
      `Structure Depth: ${this.calculateMaxDepth()} levels`,
    ].join('\n')
  }

  private buildHierarchicalContext(): string {
    const hierarchicalNodes = this.contextNodes
      .filter(ctx => ['self', 'parent', 'grandparent'].includes(ctx.relationship))
      .sort((a, b) => a.depth - b.depth)

    if (hierarchicalNodes.length === 0) return ''

    const sections = hierarchicalNodes.map(ctx => {
      const indent = '='.repeat(Math.max(1, ctx.depth + 1))
      const relationship = ctx.relationship === 'self' ? 'CURRENT' : ctx.relationship.toUpperCase()

      return [
        `${indent} ${relationship} ${ctx.node.levelName.toUpperCase()}: "${ctx.node.title}"`,
        `Summary: ${ctx.node.summary}`,
        `Status: ${ctx.node.status}`,
      ].join('\n')
    })

    return `=== HIERARCHICAL CONTEXT ===\n${sections.join('\n\n')}`
  }

  private buildRelationalContext(): string {
    const siblings = this.contextNodes.filter(ctx => ctx.relationship === 'sibling')
    const children = this.contextNodes.filter(ctx => ctx.relationship === 'child')

    const sections: string[] = []

    if (siblings.length > 0) {
      sections.push(
        `--- SIBLINGS (${siblings.length}) ---`,
        ...siblings.map(
          ctx =>
            `• ${ctx.node.levelName}: "${ctx.node.title}" - ${ctx.node.summary} [${ctx.node.status}]`
        )
      )
    }

    if (children.length > 0) {
      sections.push(
        `--- CHILDREN (${children.length}) ---`,
        ...children.map(
          ctx =>
            `• ${ctx.node.levelName}: "${ctx.node.title}" - ${ctx.node.summary} [${ctx.node.status}]`
        )
      )
    }

    return sections.length > 0 ? `=== RELATIONAL CONTEXT ===\n${sections.join('\n')}` : ''
  }

  private buildStructuralContext(): string {
    const cousins = this.contextNodes.filter(ctx => ctx.relationship === 'cousin')

    if (cousins.length === 0) return ''

    return [
      `=== STRUCTURAL CONTEXT ===`,
      `--- RELATED NODES (${cousins.length}) ---`,
      ...cousins.map(ctx => `• ${ctx.node.levelName}: "${ctx.node.title}" - ${ctx.node.summary}`),
    ].join('\n')
  }

  private buildExistingChildrenContext(targetNode: FractalNode): string {
    if (targetNode.children.length === 0) return ''

    return [
      `--- EXISTING CHILDREN (${targetNode.children.length}) ---`,
      ...targetNode.children.map(
        (child, index) =>
          `${index + 1}. ${child.levelName}: "${child.title}" - ${child.summary} [${child.status}]`
      ),
    ].join('\n')
  }

  private buildSiblingPatternsContext(): string {
    const siblings = this.contextNodes.filter(ctx => ctx.relationship === 'sibling')
    if (siblings.length === 0) return ''

    const siblingChildren = siblings.filter(ctx => ctx.node.children.length > 0).slice(0, 2) // Limit to 2 siblings for pattern analysis

    if (siblingChildren.length === 0) return ''

    const patterns = siblingChildren.map(ctx => {
      const childTypes = ctx.node.children.map(child => child.levelName)
      const uniqueTypes = [...new Set(childTypes)]

      return `${ctx.node.levelName} "${ctx.node.title}" has: ${uniqueTypes.join(', ')}`
    })

    return [`--- SIBLING PATTERNS ---`, ...patterns].join('\n')
  }

  private findNodeByPath(rootNode: FractalNode, path: string[]): FractalNode | null {
    if (path.length === 0) return rootNode

    let current = rootNode
    for (const nodeId of path) {
      const child = current.children.find(c => c.id === nodeId)
      if (!child) return null
      current = child
    }

    return current
  }

  private calculateMaxDepth(): number {
    const calculateDepth = (node: FractalNode, depth = 0): number => {
      if (node.children.length === 0) return depth
      return Math.max(...node.children.map(child => calculateDepth(child, depth + 1)))
    }

    return calculateDepth(this.fractal.rootNode)
  }
}

// Convenience functions for backward compatibility
export function buildSmartContext(fractal: Fractal, targetPath: string[]): string {
  return new ContextBuilder(fractal, targetPath).buildContext()
}

export function buildChildGenerationContext(
  fractal: Fractal,
  targetPath: string[],
  childLevelName: string
): string {
  return new ContextBuilder(fractal, targetPath).buildChildGenerationContext(childLevelName)
}
