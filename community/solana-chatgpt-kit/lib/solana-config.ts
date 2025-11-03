import { Connection, Keypair } from '@solana/web3.js'
import bs58 from 'bs58'

// External wallet configuration
// Set to true to use external wallet (Phantom/injected wallet) for signing
// Set to false to use server-side private key for signing
export const externalWallet = true

// Token addresses
export const TOKENS = {
  SOL: 'So11111111111111111111111111111111111111112',
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
} as const

export const TOKEN_DECIMALS = {
  SOL: 9,
  USDC: 6,
  USDT: 6,
} as const

// Liquid Staking Tokens (LST)
export const JUPSOL_MINT = 'jupSoLaHXQiZZTSfEWMTRRgpnyFm8f6sZdosWBjx93v' // JupSOL mint
export const LST_DECIMALS = {
  JUPSOL: 9,
} as const

// Initialize Solana connection
export function getSolanaConnection(): Connection {
  const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
  return new Connection(rpcUrl, 'confirmed')
}

// Get wallet keypair from environment (only used when externalWallet is false)
export function getWalletKeypair(): Keypair {
  if (externalWallet) {
    throw new Error('getWalletKeypair should not be called when externalWallet is true')
  }

  const privateKey = process.env.SOLANA_PRIVATE_KEY

  if (!privateKey) {
    throw new Error('SOLANA_PRIVATE_KEY not found in environment variables')
  }

  try {
    const secretKey = bs58.decode(privateKey)
    return Keypair.fromSecretKey(secretKey)
  } catch (error) {
    throw new Error('Invalid SOLANA_PRIVATE_KEY format. Must be base58 encoded.')
  }
}

// Jupiter API endpoints (Free tier)
export const JUPITER_API = {
  QUOTE: 'https://lite-api.jup.ag/swap/v1/quote',
  SWAP: 'https://lite-api.jup.ag/swap/v1/swap',
  PRICE: 'https://lite-api.jup.ag/price/v3',
} as const

// Optional referral settings
export const JUP_REFERRAL_ADDRESS = ''
export const JUP_REFERRAL_FEE = 0
