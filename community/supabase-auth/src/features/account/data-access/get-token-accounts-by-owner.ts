import { address as toAddress } from '@solana/kit'
import type { AppClient } from '@/components/solana/solana-client'

export async function getTokenAccountsByOwner(
  client: AppClient,
  { address, programId }: { address: string; programId: string },
) {
  return await client.rpc
    .getTokenAccountsByOwner(
      toAddress(address),
      { programId: toAddress(programId) },
      { commitment: 'confirmed', encoding: 'jsonParsed' },
    )
    .send()
    .then((res) => res.value ?? [])
}
