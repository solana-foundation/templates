import { Currency } from '@project/anchor'

export const LAMPORTS_PER_SOL = 1_000_000_000

export function lamportsToSol(lamports: bigint): number {
  return Number(lamports) / LAMPORTS_PER_SOL
}

export function solToLamports(sol: number): bigint {
  return BigInt(Math.round(sol * LAMPORTS_PER_SOL))
}

// Parses user input like "1.5" into a positive number, or null when invalid.
export function parseAmountInput(input: string): number | null {
  const value = Number(input.trim().replace(',', '.'))
  return Number.isFinite(value) && value > 0 ? value : null
}

export function formatSol(lamports: bigint): string {
  return `${lamportsToSol(lamports).toLocaleString(undefined, { maximumFractionDigits: 4 })} SOL`
}

export function formatUsd(lamports: bigint, solPrice: number): string {
  return `$${(lamportsToSol(lamports) * solPrice).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

// Renders a lamports amount in the pot's display currency. Amounts on chain
// are always SOL; `Currency.Usd` only changes the presentation.
export function formatAmount(lamports: bigint, currency: Currency, solPrice: number | null | undefined): string {
  if (currency === Currency.Usd && solPrice) {
    return formatUsd(lamports, solPrice)
  }
  return formatSol(lamports)
}
