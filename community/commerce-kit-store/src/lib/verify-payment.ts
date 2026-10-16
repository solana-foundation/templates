import { address, signature } from '@solana/kit'
import type { AppClient } from './solana-client'

export function usdcMinorUnits(amount: number): bigint {
  const minorUnits = Math.round(amount * 1_000_000)
  if (!Number.isFinite(amount) || amount <= 0 || !Number.isSafeInteger(minorUnits) || minorUnits <= 0) {
    throw new Error('Enter a positive USDC amount within the supported range.')
  }
  return BigInt(minorUnits)
}

export async function verifyUsdcPayment(
  rpc: Pick<AppClient['rpc'], 'getTransaction'>,
  transactionSignature: string,
  expected: { amount: bigint; recipient: string; mint: string; reference: string },
) {
  const transaction = await rpc
    .getTransaction(signature(transactionSignature), {
      encoding: 'jsonParsed',
      commitment: 'confirmed',
      maxSupportedTransactionVersion: 1,
    })
    .send()

  if (!transaction) return { verified: false, retryable: true, error: 'Transaction not found' }
  if (!transaction.meta || transaction.meta.err !== null) {
    return { verified: false, retryable: false, error: 'Payment transaction failed' }
  }
  const reference = address(expected.reference)
  if (!transaction.transaction.message.accountKeys.some((key) => key.pubkey === reference)) {
    return { verified: false, retryable: false, error: 'Payment reference does not match' }
  }

  const recipient = address(expected.recipient)
  const mint = address(expected.mint)
  const pre = transaction.meta.preTokenBalances ?? []
  const post = transaction.meta.postTokenBalances ?? []
  const total = (balances: typeof post) =>
    balances.reduce(
      (sum, balance) =>
        balance.owner === recipient && balance.mint === mint ? sum + BigInt(balance.uiTokenAmount.amount) : sum,
      0n,
    )
  const received = total(post) - total(pre)
  return received >= expected.amount
    ? { verified: true, retryable: false }
    : { verified: false, retryable: false, error: 'Payment amount, recipient or mint does not match' }
}
