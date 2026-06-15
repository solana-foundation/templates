import { Transaction } from '@mysten/sui/transactions'

import type { ExecuteSui } from '@/lib/ika'
import { suiClient } from '@/lib/sui'
import { getOperatorKeypair } from '@/lib/operator'

/**
 * Signs + executes an Ika Sui transaction with the generated operator keypair.
 *
 * The operator is an in-app Ed25519 keypair (see lib/operator.ts), so there's
 * no wallet popup: every DKG / presign / sign transaction is signed directly
 * and paid from the operator's SUI + IKA. Returns the digest and parsed events,
 * which the Ika flow needs.
 *
 * This mirrors the Ika SDK's own integration tests, which sign with a Keypair
 * via `suiClient.core.signAndExecuteTransaction`.
 */
async function executeSui(transaction: Transaction): ReturnType<ExecuteSui> {
  const operator = getOperatorKeypair()
  if (!operator) throw new Error('Generate the Sui operator keypair first.')

  // The sender must be set before resolving `coinWithBalance` (it lists the
  // operator's coins). We sign with the same keypair.
  transaction.setSenderIfNotSet(operator.toSuiAddress())

  const result = await suiClient.core.signAndExecuteTransaction({
    transaction,
    signer: operator,
    include: { events: true },
  })

  // The core API returns a discriminated result; the success arm is `.Transaction`,
  // and its events expose `eventType` + `bcs` (which the Ika flow parses).
  const tx = (result as { Transaction?: { digest: string; events?: { eventType: string; bcs?: unknown }[] } })
    .Transaction
  if (!tx) throw new Error('Sui transaction did not execute successfully')

  return {
    digest: tx.digest,
    events: (tx.events ?? []).map((e) => ({
      type: e.eventType,
      bcs: e.bcs as string | number[] | Uint8Array | undefined,
    })),
  }
}

/**
 * Kept as a hook-named export so call sites read naturally, but it no longer
 * uses any React/wallet context. Returns the stable `executeSui` function.
 */
export function useExecuteSui(): ExecuteSui {
  return executeSui
}
