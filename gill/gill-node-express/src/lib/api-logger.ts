import c from 'kleur'

export interface ApiLogger {
  info: (message: string, meta?: Record<string, unknown>) => void
  error: (message: string, error?: unknown) => void
  warn: (message: string, meta?: Record<string, unknown>) => void
  debug: (message: string, meta?: Record<string, unknown>) => void
}

export const log: ApiLogger = {
  info: (message: string, meta?: Record<string, unknown>): void => {
    console.info(c.white(`[INFO] ${message}`), meta || '')
  },
  error: (message: string, error?: unknown): void => {
    console.error(c.red(`[ERROR] ${message}`), error instanceof Error ? error.stack : error || '')
  },
  warn: (message: string, meta?: Record<string, unknown>): void => {
    console.warn(c.yellow(`[WARN] ${message}`), meta || '')
  },
  debug: (message: string, meta?: Record<string, unknown>): void => {
    console.debug(c.gray(`[DEBUG] ${message}`), meta || '')
  },
}
