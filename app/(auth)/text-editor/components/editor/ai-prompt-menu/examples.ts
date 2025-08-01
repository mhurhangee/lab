interface PromptExample {
  id: string
  label: string
  prompt: string
  icon: string
  description?: string
}

export const PROMPT_EXAMPLES: PromptExample[] = [
  {
    id: 'improve',
    label: 'Improve writing',
    prompt: 'Improve the writing style and clarity of this text',
    icon: '✨',
    description: 'Make text clearer and more engaging',
  },
  {
    id: 'fix-grammar',
    label: 'Fix grammar',
    prompt: 'Fix any grammar and spelling mistakes in this text',
    icon: '✅',
    description: 'Correct grammar and spelling errors',
  },
  {
    id: 'make-shorter',
    label: 'Make shorter',
    prompt: 'Make this text more concise while keeping the key points',
    icon: '🔗',
    description: 'Reduce length while preserving meaning',
  },
  {
    id: 'make-longer',
    label: 'Make longer',
    prompt: 'Expand this text with more detail and examples',
    icon: '📝',
    description: 'Add more detail and context',
  },
  {
    id: 'continue',
    label: 'Continue writing',
    prompt: 'Continue writing this text in the same style and tone',
    icon: '▶️',
    description: 'Generate a continuation',
  },
]
