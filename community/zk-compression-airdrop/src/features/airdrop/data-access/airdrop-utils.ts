import { PublicKey, ComputeBudgetProgram } from '@solana/web3.js'
import BN from 'bn.js'
import { createRpc, selectStateTreeInfo } from '@lightprotocol/stateless.js'
import { CompressedTokenProgram, getTokenPoolInfos, selectTokenPoolInfo } from '@lightprotocol/compressed-token'
import { getMint } from '@solana/spl-token'
import type { AirdropConfig, AirdropData } from './airdrop-types'
import type { AppClient } from '@/lib/solana-client'
import { toKitInstruction } from '@/lib/light-instruction'

export type { AirdropConfig, AirdropData, AirdropProgress, AirdropRecipient } from './airdrop-types'

export const MAX_BATCH_SIZE = 5

export function validateAirdrop(config: AirdropConfig, data: AirdropData, batchSize: number) {
  if (!Number.isInteger(batchSize) || batchSize < 1 || batchSize > MAX_BATCH_SIZE)
    throw new Error('Batch size must be between 1 and 5')
  if (config.mintAddress !== data.mint || config.decimals !== data.decimals)
    throw new Error('Mint or decimals do not match the recipient list')
  if (!Number.isInteger(config.decimals) || config.decimals < 0 || config.decimals > 255)
    throw new Error('Invalid token decimals')
  new PublicKey(config.mintAddress)
  new PublicKey(config.authority)
  const parsed = parseRecipients(data)
  if (!parsed.recipients.length || data.totalRecipients !== parsed.recipients.length)
    throw new Error('Invalid recipient count')
  if (new Set(data.recipients.map((r) => r.recipient)).size !== data.recipients.length)
    throw new Error('Duplicate recipient address')
  if (parsed.amounts.reduce((sum, amount) => sum + amount, 0n).toString() !== data.totalAmount)
    throw new Error('Total amount does not match recipients')
  return parsed
}

export async function prepareAirdropBatch(
  client: AppClient,
  config: AirdropConfig,
  prepared: ReturnType<typeof validateAirdrop>,
  start: number,
  batchSize: number,
  signal: AbortSignal,
) {
  const connected = client.wallet.getState().connected
  if (!connected?.signer) throw new Error('Connect a signing wallet first')
  const signer = connected.signer
  const assertCurrent = () => {
    signal.throwIfAborted()
    if (!connected?.signer || client.wallet.getState().connected !== connected)
      throw new Error('Wallet changed or disconnected. Airdrop stopped.')
  }
  assertCurrent()
  if (!connected.supportedTransactionVersions.has(1))
    throw new Error('This wallet does not advertise V1 transaction support')
  if (connected.account.address !== config.authority) throw new Error('Connected wallet is not the mint authority')
  const { recipients, amounts } = prepared
  if (!Number.isInteger(batchSize) || batchSize < 1 || batchSize > MAX_BATCH_SIZE)
    throw new Error('Batch size must be between 1 and 5')
  if (!Number.isInteger(start) || start < 0 || start >= recipients.length) throw new Error('Invalid batch offset')
  const rpc = createRpcConnection(config.network)
  const expectedGenesis = await client.rpc.getGenesisHash().send({ abortSignal: signal })
  if ((await rpc.getGenesisHash()) !== expectedGenesis)
    throw new Error('Selected network does not match the compressed mint network')
  assertCurrent()
  const mint = new PublicKey(config.mintAddress)
  const mintInfo = await getMint(rpc, mint, 'confirmed')
  if (mintInfo.mintAuthority?.toBase58() !== config.authority || mintInfo.decimals !== config.decimals)
    throw new Error('On-chain mint authority or decimals do not match the setup')
  assertCurrent()
  const tree = selectStateTreeInfo(await rpc.getStateTreeInfos())
  const pool = selectTokenPoolInfo(await getTokenPoolInfos(rpc, mint))
  assertCurrent()
  const ix = await CompressedTokenProgram.mintTo({
    feePayer: new PublicKey(connected.account.address),
    mint,
    authority: new PublicKey(config.authority),
    toPubkey: recipients.slice(start, start + batchSize),
    amount: amounts.slice(start, start + batchSize).map((a) => new BN(a.toString())),
    outputStateTreeInfo: tree,
    tokenPoolInfo: pool,
  })
  assertCurrent()
  return [ComputeBudgetProgram.setComputeUnitLimit({ units: 1_000_000 }), ix].map((instruction) =>
    toKitInstruction(instruction, [signer]),
  )
}

export function createRpcConnection(endpoint: string) {
  // createRpc accepts 3 endpoints: (1) standard Solana RPC, (2) compression API (Photon indexer), (3) prover
  // Helius provides all three services on the same endpoint, so we pass it three times
  // See: https://www.zkcompression.com/learn/node-operators
  return createRpc(endpoint, endpoint, endpoint)
}

export function parseRecipients(merkleData: AirdropData) {
  return {
    recipients: merkleData.recipients.map((r) => new PublicKey(r.recipient)),
    amounts: merkleData.recipients.map((r) => {
      if (typeof r.amount !== 'string' || !/^[0-9]+$/.test(r.amount))
        throw new Error('Amounts must be exact positive integer strings')
      const amount = BigInt(r.amount)
      if (amount <= 0n || amount > 0xffffffffffffffffn) throw new Error('Token amount is outside the u64 range')
      return amount
    }),
  }
}

export function calculateBatches(totalRecipients: number, batchSize: number) {
  return Math.ceil(totalRecipients / batchSize)
}

export function formatTokenAmount(amount: string | bigint, decimals: number): string {
  const amountBigInt = typeof amount === 'string' ? BigInt(amount) : amount
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 255 || amountBigInt < 0n)
    throw new Error('Invalid token amount')
  const scale = 10n ** BigInt(decimals)
  const whole = (amountBigInt / scale).toLocaleString('en-US')
  const fraction = (amountBigInt % scale).toString().padStart(decimals, '0').replace(/0+$/, '')
  return fraction ? `${whole}.${fraction}` : whole
}
