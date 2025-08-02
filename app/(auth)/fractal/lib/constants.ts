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

export const AI_CONFIG = {
  MAX_CHILDREN_SUGGESTIONS: 5,
  MIN_CHILDREN_SUGGESTIONS: 3,
  CONTEXT_TRUNCATE_LENGTH: 6000,
  RETRY_ATTEMPTS: 3,
  TIMEOUT_MS: 30000,
} as const

export const UI_CONFIG = {
  ANIMATION_DURATION: 200,
  DEBOUNCE_DELAY: 300,
  AUTO_SAVE_DELAY: 2000,
} as const
