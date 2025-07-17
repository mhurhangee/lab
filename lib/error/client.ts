// handleErrorClient.ts
import { toast } from 'sonner';
import { parseError } from './parse';
import { logger } from '@/lib/logger';

export const handleErrorClient = (
  title: string,
  error: unknown,
  context?: string
) => {
  const description = parseError(error);
  toast.error(title, { description });
  logger.error(error, context);
};
