/**
 * Formatting helpers for SOL and lamport values.
 * 1 SOL = 1_000_000_000 lamports.
 */

const LAMPORTS_PER_SOL = 1_000_000_000n

/** Convert lamports (bigint) to a human-readable SOL string, e.g. "1.234" */
export function lamportsToSol(lamports: bigint): string {
  const whole = lamports / LAMPORTS_PER_SOL
  const frac = lamports % LAMPORTS_PER_SOL
  // pad fractional part to 9 digits, then trim trailing zeros
  const fracStr = frac.toString().padStart(9, '0').replace(/0+$/, '')
  return fracStr ? `${whole}.${fracStr}` : `${whole}`
}

/** Convert a SOL amount string (e.g. "0.1") to lamports bigint */
export function solToLamports(sol: string): bigint {
  const [whole = '0', frac = ''] = sol.split('.')
  const padded = frac.padEnd(9, '0').slice(0, 9)
  return BigInt(whole) * LAMPORTS_PER_SOL + BigInt(padded)
}

/** Shorten a base-58 address for display: "Ceaa…ejfD" */
export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}…${address.slice(-chars)}`
}

/** Human-readable elapsed time, e.g. "2h 15m ago" */
export function timeAgo(unixTimestamp: bigint): string {
  const now = BigInt(Math.floor(Date.now() / 1000))
  const diff = Number(now - unixTimestamp)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m ago`
  return `${Math.floor(diff / 86400)}d ago`
}
