import type { SolanaClient } from '@solana/client'
import { toAddress } from '@solana/client'

export async function getTokenAccountsByOwner(
  client: SolanaClient,
  { address, programId }: { address: string; programId: string },
) {
  return await client.runtime.rpc
    .getTokenAccountsByOwner(
      toAddress(address),
      { programId: toAddress(programId) },
      { commitment: 'confirmed', encoding: 'jsonParsed' },
    )
    .send()
    .then((res) => res.value ?? [])
}
