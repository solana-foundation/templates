export async function withRetry<T>(
  operation: () => Promise<T>,
  options: { attempts?: number; baseDelayMs?: number; label?: string } = {},
): Promise<T> {
  const attempts = options.attempts ?? 5
  const baseDelayMs = options.baseDelayMs ?? 500

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation()
    } catch (error) {
      if (attempt === attempts) throw error
      const jitter = Math.floor(Math.random() * 150)
      const delay = baseDelayMs * 2 ** (attempt - 1) + jitter
      console.warn(
        `${options.label ?? 'operation'} failed (attempt ${attempt}/${attempts}); retrying in ${delay}ms`,
        error,
      )
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw new Error('Retry loop exited unexpectedly')
}

export function exponentialBackoffDelay(
  attempt: number,
  options: {
    baseDelayMs?: number
    maxDelayMs?: number
    jitterMs?: number
    random?: () => number
  } = {},
) {
  const baseDelayMs = options.baseDelayMs ?? 1_000
  const maxDelayMs = options.maxDelayMs ?? 30_000
  const jitterMs = options.jitterMs ?? 250
  const random = options.random ?? Math.random
  const exponentialDelay = Math.min(maxDelayMs, baseDelayMs * 2 ** Math.max(0, attempt - 1))
  const jitter = Math.floor(random() * jitterMs)

  return Math.min(maxDelayMs, exponentialDelay + jitter)
}

export function waitForDelay(delayMs: number, signal?: AbortSignal) {
  if (signal?.aborted) return Promise.resolve()

  return new Promise<void>((resolve) => {
    const finish = () => {
      clearTimeout(timer)
      signal?.removeEventListener('abort', finish)
      resolve()
    }
    const timer = setTimeout(finish, delayMs)
    signal?.addEventListener('abort', finish, { once: true })
  })
}
