import { PublicKey, type Keypair } from '@solana/web3.js'
import BN from 'bn.js'
import { createRpc, type Rpc } from '@lightprotocol/stateless.js'
import { mintTo } from '@lightprotocol/compressed-token'
import type { AirdropData } from './airdrop-types'

export type { AirdropConfig, AirdropData, AirdropProgress, AirdropRecipient } from './airdrop-types'

export async function executeAirdropBatch(
  rpc: Rpc,
  mintAuthority: Keypair,
  mint: PublicKey,
  recipients: PublicKey[],
  amounts: bigint[],
): Promise<string> {
  const bnAmounts = amounts.map((a) => new BN(a.toString()))
  return await mintTo(rpc, mintAuthority, mint, recipients, mintAuthority, bnAmounts)
}

export function createRpcConnection(endpoint: string): Rpc {
  // createRpc accepts 3 endpoints: (1) standard Solana RPC, (2) compression API (Photon indexer), (3) prover
  // Helius provides all three services on the same endpoint, so we pass it three times
  // See: https://www.zkcompression.com/learn/node-operators
  return createRpc(endpoint, endpoint, endpoint)
}

export function parseRecipients(merkleData: AirdropData) {
  return {
    recipients: merkleData.recipients.map((r) => new PublicKey(r.recipient)),
    amounts: merkleData.recipients.map((r) => BigInt(r.amount)),
  }
}

export function calculateBatches(totalRecipients: number, batchSize: number) {
  return Math.ceil(totalRecipients / batchSize)
}

export function formatTokenAmount(amount: string | bigint, decimals: number): string {
  const amountBigInt = typeof amount === 'string' ? BigInt(amount) : amount
  return (Number(amountBigInt) / 10 ** decimals).toLocaleString()
}
