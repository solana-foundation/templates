import { formatDecimalFixedPoint, lamportsToSol, type Lamports } from '@solana/kit'

const formatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 5 })

/**
 * Renders a lamport balance as SOL.
 *
 * `lamportsToSol` returns a fixed-point value rather than a `number`, so the conversion never loses
 * precision on the way to the screen — a balance is an integer count of lamports, and 2^53 of them
 * is only about 9 million SOL.
 */
export function formatSol(lamports: Lamports): string {
  return `${formatDecimalFixedPoint(formatter, lamportsToSol(lamports))} ◎`
}
