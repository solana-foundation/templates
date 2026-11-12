/** Kit points at `cause` rather than repeating it, so this sentence is noise once we follow it. */
const DEFERS_TO_CAUSE = /\s*Inspect the `cause` property of this error to learn more\.?\s*$/

function messageOf(error: unknown): string {
  if (error instanceof Error) {
    return error.message.trim()
  }
  if (typeof error === 'string') {
    return error.trim()
  }
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message.trim()
  }
  return ''
}

/**
 * Turns anything thrown into something worth putting on screen, following the `cause` chain.
 *
 * Following it is the whole point. A failed transaction surfaces as a Kit error whose own message
 * explains that resource-limit estimation failed and then tells you to inspect `cause` — the reason
 * the simulation actually failed, the part a user can act on, is one level down. Reporting only the
 * top of the chain turns "this account has no SOL to pay the fee" into a paragraph about estimation.
 *
 * Wallet rejections arrive as plain `Error`s from the wallet itself, RPC failures as `SolanaError`s,
 * and a stray string or object is always possible from a browser extension. All of them end up here.
 */
export function formatError(error: unknown, fallback = 'Something went wrong'): string {
  const messages: string[] = []
  const seen = new Set<unknown>()
  let current: unknown = error

  while (current != null && !seen.has(current) && messages.length < 4) {
    seen.add(current)
    const message = messageOf(current).replace(DEFERS_TO_CAUSE, '')
    // Wrappers often restate the message they wrap; only keep what adds something.
    if (message && !messages.some((existing) => existing.includes(message) || message.includes(existing))) {
      messages.push(message)
    }
    current = typeof current === 'object' && current !== null ? (current as { cause?: unknown }).cause : undefined
  }

  return messages.join(' → ') || fallback
}
