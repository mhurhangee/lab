// logger.ts
import { parseError } from '@/lib/error/parse';

type LoggerOptions = {
  context?: string;
  extra?: Record<string, unknown>;
};

const shouldDebug = process.env.NODE_ENV === 'development';

export const logger = {
  debug: (message: string, options?: LoggerOptions) => {
    if (shouldDebug) {
      const prefix = options?.context ? `[${options.context}]` : '';
      console.debug(`${prefix} ${message}`, options?.extra || '');
    }
  },
  error: (error: unknown, context?: string, extra?: Record<string, unknown>) => {
    const prefix = context ? `[${context}]` : '';
    const message = parseError(error);
    console.error(`${prefix} ${message}`, extra);
    
    // TODO: Add remote logging (PostHog, Sentry, etc.) here
  },
};
