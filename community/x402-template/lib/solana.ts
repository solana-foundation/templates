import { Connection, PublicKey, TransactionInstruction } from '@solana/web3.js'
import {
  getAssociatedTokenAddress,
  createTransferCheckedInstruction as splCreateTransferCheckedInstruction,
} from '@solana/spl-token'
import { env } from './env'

export function getConnection(): Connection {
  return new Connection(env.NEXT_PUBLIC_RPC_ENDPOINT, 'confirmed')
}

export function getUsdcMintPk(): PublicKey {
  return new PublicKey(env.NEXT_PUBLIC_USDC_DEVNET_MINT)
}

export function getTreasuryPk(): PublicKey {
  return new PublicKey(env.NEXT_PUBLIC_TREASURY_ADDRESS)
}

export async function getAssociatedTokenAddressAsync(mint: PublicKey, owner: PublicKey): Promise<PublicKey> {
  return getAssociatedTokenAddress(mint, owner)
}

export async function createUsdcTransferCheckedIx(params: {
  source: PublicKey
  destination: PublicKey
  owner: PublicKey
  amount: number
}): Promise<TransactionInstruction> {
  const mint = getUsdcMintPk()
  const decimals = env.NEXT_PUBLIC_USDC_DECIMALS

  return splCreateTransferCheckedInstruction(
    params.source,
    mint,
    params.destination,
    params.owner,
    params.amount,
    decimals,
  )
}

export async function confirmTransaction(signature: string): Promise<void> {
  const connection = getConnection()
  const confirmResult = await connection.confirmTransaction(signature, 'finalized')

  if (confirmResult.value.err) {
    throw new Error(`Transaction failed on-chain: ${JSON.stringify(confirmResult.value.err)}`)
  }
}
