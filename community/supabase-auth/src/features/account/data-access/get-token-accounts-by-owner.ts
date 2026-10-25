import type { AppClient } from '@/lib/solana-client'
import { address as toAddress } from '@solana/kit'

export async function getTokenAccountsByOwner(
  client: AppClient,
  { address, programId }: { address: string; programId: string },
  signal?: AbortSignal,
) {
  return await client.rpc
    .getTokenAccountsByOwner(
      toAddress(address),
      { programId: toAddress(programId) },
      { commitment: 'confirmed', encoding: 'jsonParsed' },
    )
    .send({ abortSignal: signal })
    .then((res) => res.value ?? [])
}
