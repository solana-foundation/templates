import type { createSolanaRpc, Signature } from '@solana/kit'

type SolanaRpc = ReturnType<typeof createSolanaRpc>

// Polls until the cluster confirms the transaction, for flows where someone
// else (the wallet, the faucet) submitted it.
export async function waitForConfirmation(rpc: SolanaRpc, transactionSignature: Signature, timeoutMs = 30_000) {
  const startedAt = Date.now()
  while (Date.now() - startedAt < timeoutMs) {
    const {
      value: [status],
    } = await rpc.getSignatureStatuses([transactionSignature]).send()
    if (status?.err) {
      throw new Error(`Transaction ${transactionSignature} failed: ${JSON.stringify(status.err)}`)
    }
    if (status?.confirmationStatus === 'confirmed' || status?.confirmationStatus === 'finalized') {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 1_000))
  }
  throw new Error(`Timed out waiting for transaction ${transactionSignature} to confirm.`)
}
