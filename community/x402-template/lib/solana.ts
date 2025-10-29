import {
  createSolanaClient,
  address,
  type Address,
  type SolanaClient,
  signature,
  getProgramDerivedAddress,
  getAddressEncoder,
  type Instruction,
  AccountRole,
} from 'gill'
import { env } from './env'

export const TOKEN_PROGRAM_ID = address('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
export const ASSOCIATED_TOKEN_PROGRAM_ID = address('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL')

let gillClient: SolanaClient | null = null

export function getClient(): SolanaClient {
  if (!gillClient) {
    gillClient = createSolanaClient({
      urlOrMoniker: 'devnet',
    })
  }
  return gillClient
}

export function getUsdcMintPk(): Address {
  return address(env.NEXT_PUBLIC_USDC_DEVNET_MINT)
}

export function getTreasuryPk(): Address {
  return address(env.NEXT_PUBLIC_TREASURY_ADDRESS)
}

export async function getAssociatedTokenAddress(mint: Address, owner: Address): Promise<Address> {
  const [ata] = await getProgramDerivedAddress({
    programAddress: ASSOCIATED_TOKEN_PROGRAM_ID,
    seeds: [
      getAddressEncoder().encode(owner),
      getAddressEncoder().encode(TOKEN_PROGRAM_ID),
      getAddressEncoder().encode(mint),
    ],
  })
  return ata
}

export function createTransferCheckedInstruction(params: {
  source: Address
  mint: Address
  destination: Address
  owner: Address
  amount: bigint
  decimals: number
}): Instruction {
  const data = new Uint8Array(10)
  data[0] = 12 // TransferChecked instruction discriminator

  // Amount as little-endian u64
  const amountView = new DataView(data.buffer, 1, 8)
  amountView.setBigUint64(0, params.amount, true)

  // Decimals as u8
  data[9] = params.decimals

  return {
    programAddress: TOKEN_PROGRAM_ID,
    accounts: [
      { address: params.source, role: AccountRole.WRITABLE },
      { address: params.mint, role: AccountRole.READONLY },
      { address: params.destination, role: AccountRole.WRITABLE },
      { address: params.owner, role: AccountRole.WRITABLE_SIGNER },
    ],
    data,
  }
}

export async function getTokenAccountBalance(tokenAccount: Address): Promise<bigint> {
  const { rpc } = getClient()
  
  try {
    const accountInfo = await rpc.getAccountInfo(tokenAccount, { encoding: 'base64' }).send()
    
    if (!accountInfo.value) {
      return BigInt(0)
    }

    const data = accountInfo.value.data
    let dataBytes: Uint8Array
    
    if (typeof data === 'string') {
      dataBytes = new Uint8Array(Buffer.from(data, 'base64'))
    } else if (Array.isArray(data)) {
      dataBytes = new Uint8Array(Buffer.from(data[0], 'base64'))
    } else {
      dataBytes = new Uint8Array(Buffer.from(data as string, 'base64'))
    }
    
    // Token account balance is at offset 64 (u64 little-endian)
    const balanceView = new DataView(dataBytes.buffer, 64, 8)
    const balance = balanceView.getBigUint64(0, true)
    
    return balance
  } catch {
    // If account doesn't exist or error reading, return 0
    return BigInt(0)
  }
}

export async function confirmTransaction(signatureStr: string): Promise<void> {
  const { rpc } = getClient()
  const sig = signature(signatureStr)

  let confirmed = false
  let attempts = 0
  const maxAttempts = 30

  while (!confirmed && attempts < maxAttempts) {
    try {
      const result = await rpc.getSignatureStatuses([sig]).send()
      const status = result.value[0]

      if (status?.err) {
        throw new Error(`Transaction failed on-chain: ${JSON.stringify(status.err)}`)
      }

      if (status?.confirmationStatus === 'confirmed' || status?.confirmationStatus === 'finalized') {
        confirmed = true
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        attempts++
      }
    } catch (error) {
      if (attempts >= maxAttempts - 1) {
        throw error
      }
      attempts++
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  if (!confirmed) {
    throw new Error(`Transaction confirmation timeout after ${maxAttempts} attempts`)
  }
}
