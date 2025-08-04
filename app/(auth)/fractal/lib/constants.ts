// Centralized constants
export const APP_CONFIG = {
  DEFAULT_MAX_DEPTH: 10,
  DEFAULT_MAX_SIBLINGS: 50,
  VERSION: '2.0.0',
  MIN_CONTEXT_LENGTH: 10,
  MAX_CONTEXT_LENGTH: 8000,
} as const

export const STATUS_CONFIG = {
  EMPTY: {
    value: 'empty' as const,
    color: 'bg-red-500',
    label: 'Empty',
    description: 'No content yet',
  },
  IN_PROGRESS: {
    value: 'in-progress' as const,
    color: 'bg-yellow-500',
    label: 'In Progress',
    description: 'Work in progress',
  },
  COMPLETE: {
    value: 'complete' as const,
    color: 'bg-green-500',
    label: 'Complete',
    description: 'Finished',
  },
} as const
