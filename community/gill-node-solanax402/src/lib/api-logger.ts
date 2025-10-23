/**
 * API Logger - Gill template pattern
 * Structured logging for the application
 */

export interface ApiLogger {
  debug: (message: string, ...args: unknown[]) => void;
  info: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
}

function formatMessage(level: string, message: string, args: unknown[]): string {
  const timestamp = new Date().toISOString();
  const argsStr = args.length > 0 ? ' ' + JSON.stringify(args) : '';
  return `${timestamp} [${level}] ${message}${argsStr}`;
}

export const log: ApiLogger = {
  debug: (message: string, ...args: unknown[]) => {
    console.debug(formatMessage('DEBUG', message, args));
  },
  info: (message: string, ...args: unknown[]) => {
    console.log(formatMessage('INFO', message, args));
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(formatMessage('WARN', message, args));
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(formatMessage('ERROR', message, args));
  },
};
