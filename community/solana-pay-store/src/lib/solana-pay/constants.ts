import { PublicKey } from '@solana/web3.js'

export const MERCHANT_WALLET = new PublicKey(
  process.env.NEXT_PUBLIC_MERCHANT_WALLET || '11111111111111111111111111111111',
)

export const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com'

export const USDC_MINT_MAINNET = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')

export const USDC_MINT = USDC_MINT_MAINNET

export const USDC_DECIMALS = 6
