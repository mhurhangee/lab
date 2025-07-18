import { logger } from '@/lib/logger'

import { parseError } from './parse'

export const handleErrorServer = (error: unknown, context?: string) => {
  const message = parseError(error)
  logger.error(error, context)
  return { error: message }
}
