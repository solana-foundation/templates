const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet'
if (!['devnet', 'testnet', 'mainnet'].includes(network)) {
  throw new Error('NEXT_PUBLIC_SOLANA_NETWORK must be devnet, testnet or mainnet')
}

export const AIRDROP_CONFIG = {
  NETWORK: network as 'devnet' | 'mainnet' | 'testnet',
  AIRDROP_PROGRAM_ID: process.env.NEXT_PUBLIC_PROGRAM_ID,
} as const

export function validateConfig(): void {
  if (!AIRDROP_CONFIG.AIRDROP_PROGRAM_ID) {
    throw new Error('NEXT_PUBLIC_PROGRAM_ID is required. Complete the program setup first.')
  }
}
