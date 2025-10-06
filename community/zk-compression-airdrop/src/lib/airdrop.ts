import { PublicKey, type Keypair } from '@solana/web3.js'
import BN from 'bn.js'
import { createRpc, type Rpc } from '@lightprotocol/stateless.js'
import { mintTo } from '@lightprotocol/compressed-token'

export interface AirdropRecipient {
  recipient: string
  amount: string
  index: number
}

export interface AirdropConfig {
  mintAddress: string
  authority: string
  decimals: number
  name: string
  symbol: string
  network: string
}

export interface AirdropData {
  mint: string
  decimals: number
  totalRecipients: number
  totalAmount: string
  recipients: AirdropRecipient[]
  generatedAt: string
}

export interface AirdropProgress {
  currentBatch: number
  totalBatches: number
  successfulMints: number
  failedMints: number
  signatures: string[]
}

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
