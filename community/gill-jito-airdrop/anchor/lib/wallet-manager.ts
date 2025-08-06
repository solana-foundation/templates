import bs58 from 'bs58'
import { generateKeyPair } from 'crypto'
import { promisify } from 'util'
import type { GillWalletInfo, GillNetworkConfig } from './types'
import {
  createSolanaRpc,
  createKeyPairSignerFromBytes,
  generateKeyPairSigner,
  lamports,
  type Address,
  type Rpc,
  type SolanaRpcApi,
} from 'gill'

const generateKeyPairAsync = promisify(generateKeyPair)

export function createGillWalletClient(config: GillNetworkConfig) {
  const networkUrls = {
    devnet: 'https://api.devnet.solana.com',
    mainnet: 'https://api.mainnet-beta.solana.com',
    testnet: 'https://api.testnet.solana.com',
  }

  const rpcUrl = config.rpcUrl || networkUrls[config.network]
  const rpc = createSolanaRpc(rpcUrl)

  return { rpc }
}

export async function generateGillWallet(name: string): Promise<GillWalletInfo> {
  const { privateKey, publicKey } = await generateKeyPairAsync('ed25519', {
    privateKeyEncoding: { type: 'pkcs8', format: 'der' },
    publicKeyEncoding: { type: 'spki', format: 'der' },
  })

  const privateKeyBytes = privateKey.slice(-32)

  const publicKeyBytes = publicKey.slice(-32)

  const secretKeyBytes = new Uint8Array(64)
  secretKeyBytes.set(privateKeyBytes, 0)
  secretKeyBytes.set(publicKeyBytes, 32)

  const signer = await createKeyPairSignerFromBytes(secretKeyBytes)

  return {
    name,
    address: signer.address,
    keypairFile: `${name}.json`,
    privateKey: {
      hex: Buffer.from(privateKeyBytes).toString('hex'),
      base58: bs58.encode(privateKeyBytes),
      array: Array.from(privateKeyBytes),
    },
    secretKey: {
      hex: Buffer.from(secretKeyBytes).toString('hex'),
      base58: bs58.encode(secretKeyBytes),
      array: Array.from(secretKeyBytes),
    },
    balance: '0 SOL',
    funded: false,
    signer, // Include the Gill signer
  }
}

export async function createGillWalletFromKey(name: string, privateKeyInput: string): Promise<GillWalletInfo> {
  let secretKeyArray: number[]

  if (privateKeyInput.length === 128) {
    const secretKeyBuffer = Buffer.from(privateKeyInput, 'hex')
    secretKeyArray = Array.from(secretKeyBuffer)
  } else if (privateKeyInput.length === 88) {
    const secretKeyBuffer = bs58.decode(privateKeyInput)
    secretKeyArray = Array.from(secretKeyBuffer)
  } else {
    throw new Error('Invalid private key format. Expected 128 char hex or 88 char base58')
  }

  const privateKeyBytes = new Uint8Array(secretKeyArray)
  const signer = await createKeyPairSignerFromBytes(privateKeyBytes)
  const privateKey = secretKeyArray.slice(0, 32)

  return {
    name,
    address: signer.address,
    keypairFile: `${name}.json`,
    privateKey: {
      hex: Buffer.from(privateKey).toString('hex'),
      base58: bs58.encode(new Uint8Array(privateKey)),
      array: privateKey,
    },
    secretKey: {
      hex: privateKeyInput.length === 128 ? privateKeyInput : Buffer.from(secretKeyArray).toString('hex'),
      base58: privateKeyInput.length === 88 ? privateKeyInput : bs58.encode(new Uint8Array(secretKeyArray)),
      array: secretKeyArray,
    },
    signer, // Include the Gill signer
  }
}

export async function checkGillWalletBalance(rpc: Rpc<SolanaRpcApi>, walletAddress: Address): Promise<number> {
  try {
    const balance = await rpc.getBalance(walletAddress).send()
    return Number(balance.value) / 1e9 // Convert lamports to SOL
  } catch (error) {
    console.error(`❌ Error checking balance for ${walletAddress}:`, error)
    return 0
  }
}

export async function requestGillAirdrop(
  rpc: Rpc<SolanaRpcApi>,
  walletAddress: Address,
  amount: number = 2,
): Promise<boolean> {
  try {
    console.log(`💧 Requesting ${amount} SOL airdrop for ${walletAddress}...`)

    const signature = await rpc.requestAirdrop(walletAddress, lamports(BigInt(amount * 1e9))).send()

    let confirmed = false
    let attempts = 0
    const maxAttempts = 30

    while (!confirmed && attempts < maxAttempts) {
      try {
        const result = await rpc.getSignatureStatuses([signature]).send()
        if (
          result.value[0]?.confirmationStatus === 'confirmed' ||
          result.value[0]?.confirmationStatus === 'finalized'
        ) {
          confirmed = true
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          attempts++
        }
      } catch {
        attempts++
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    if (confirmed) {
      console.log(`✅ Airdrop successful! Signature: ${signature}`)
      // Wait a bit for balance to update
      await new Promise((resolve) => setTimeout(resolve, 2000))
      return true
    } else {
      console.error(`❌ Airdrop confirmation timeout for ${walletAddress}`)
      return false
    }
  } catch (error) {
    console.error(`❌ Airdrop failed for ${walletAddress}:`, error)
    return false
  }
}

export async function updateGillWalletStatus(rpc: Rpc<SolanaRpcApi>, wallet: GillWalletInfo): Promise<GillWalletInfo> {
  const balance = await checkGillWalletBalance(rpc, wallet.address)
  return {
    ...wallet,
    balance: `${balance} SOL`,
    funded: balance > 0,
  }
}

export async function ensureGillWalletFunded(
  rpc: Rpc<SolanaRpcApi>,
  wallet: GillWalletInfo,
  minBalance: number = 1,
  airdropAmount: number = 2,
): Promise<GillWalletInfo> {
  const updatedWallet = await updateGillWalletStatus(rpc, wallet)
  const balance = parseFloat(updatedWallet.balance?.split(' ')[0] || '0')

  if (balance < minBalance) {
    console.log(`💧 Wallet needs funding (current: ${balance} SOL, required: ${minBalance} SOL)...`)
    const airdropSuccess = await requestGillAirdrop(rpc, wallet.address, airdropAmount)

    if (airdropSuccess) {
      return await updateGillWalletStatus(rpc, updatedWallet)
    } else {
      console.log('⚠️  Automatic airdrop failed. Please fund manually:')
      console.log(`solana airdrop ${airdropAmount} ${wallet.address} --url devnet`)
      return updatedWallet
    }
  }

  return updatedWallet
}

export async function generateGillTestWallets(rpc: Rpc<SolanaRpcApi>, count: number): Promise<GillWalletInfo[]> {
  const testWallets: GillWalletInfo[] = []

  for (let i = 1; i <= count; i++) {
    console.log(`\n📱 Creating test wallet ${i}...`)

    const wallet = await generateGillWallet(`test-wallet-${i}`)
    console.log(`✅ Created: ${wallet.address}`)

    const fundedWallet = await ensureGillWalletFunded(rpc, wallet, 0.5, 1)
    testWallets.push(fundedWallet)

    if (i < count) {
      console.log('⏳ Waiting 3 seconds before next wallet...')
      await new Promise((resolve) => setTimeout(resolve, 3000))
    }
  }

  return testWallets
}
