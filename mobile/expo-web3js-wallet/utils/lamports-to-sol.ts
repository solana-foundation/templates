import { LAMPORTS_PER_SOL } from '@solana/web3.js'

export function lamportsToSol(balance: number) {
  return Math.round((balance / LAMPORTS_PER_SOL) * 100000) / 100000
}
