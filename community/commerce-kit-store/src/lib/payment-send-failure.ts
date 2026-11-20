import {
  isFailedSingleTransactionPlanResult,
  isSolanaError,
  isTransactionPlanResult,
  SOLANA_ERROR__FAILED_TO_SEND_TRANSACTION,
} from '@solana/kit'

export function paymentSendFailure(error: unknown) {
  if (!isSolanaError(error, SOLANA_ERROR__FAILED_TO_SEND_TRANSACTION)) return null
  const result = error.context.transactionPlanResult
  if (!isTransactionPlanResult(result) || !isFailedSingleTransactionPlanResult(result)) return null
  const context = result.context as Record<string, unknown>
  if (!context.signature) return { beforeSend: true as const }
  const transaction = context.transaction as { lifetimeConstraint?: { lastValidBlockHeight?: bigint } } | undefined
  const lastValidBlockHeight = transaction?.lifetimeConstraint?.lastValidBlockHeight
  return typeof context.signature === 'string' && typeof lastValidBlockHeight === 'bigint'
    ? { beforeSend: false as const, signature: context.signature, lastValidBlockHeight }
    : null
}
