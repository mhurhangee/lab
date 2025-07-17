// handleErrorServer.ts
import { parseError } from './parse';
import { logger } from '@/lib/logger';

export const handleErrorServer = (error: unknown, context?: string) => {
  const message = parseError(error);
  logger.error(error, context);
  return { error: message };
};
