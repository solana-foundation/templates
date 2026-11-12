import type { Lamports } from '@solana/kit'

export function assertCanPayTransactionFee({ balance, fee }: { balance: Lamports; fee: Lamports | null }) {
  if (fee === null) {
    throw new Error('Unable to estimate the transaction fee. Try again with a fresh blockhash.')
  }
  if (balance < fee) {
    throw new Error('Not enough SOL to pay transaction fees on this cluster.')
  }
}
