/**
 * Airdrop System Configuration
 * Centralized configuration for the airdrop claiming system
 *
 * 💡 For development: Uses mock program ID by default
 * 🚀 For production: Set NEXT_PUBLIC_PROGRAM_ID environment variable
 *    (automatically set when you run anchor/scripts/deploy-setup.ts)
 */

export const AIRDROP_CONFIG = {
  // Network settings
  NETWORK: (process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet') as 'devnet' | 'mainnet' | 'testnet',

  // Program addresses (mock ID will be updated by deploy-setup script)
  AIRDROP_PROGRAM_ID: process.env.NEXT_PUBLIC_PROGRAM_ID,

  // Transaction settings
  MIN_SOL_BALANCE: 0.005, // Minimum SOL needed for transaction fees

  // UI settings
  ENABLE_DEBUG_LOGS: process.env.NODE_ENV === 'development',

  // Private key (for development only - server-side only)
  PRIVATE_KEY: process.env.USER_PRIVATE_KEY,
} as const

/**
 * Validates the configuration and throws errors for missing required values
 */
export function validateConfig(): void {
  if (!AIRDROP_CONFIG.PRIVATE_KEY) {
    throw new Error('USER_PRIVATE_KEY environment variable is required')
  }

  if (!AIRDROP_CONFIG.AIRDROP_PROGRAM_ID) {
    throw new Error('NEXT_PUBLIC_PROGRAM_ID environment variable is required')
  }
}

/**
 * Logs the current configuration (for debugging)
 */
export function logConfig(): void {
  if (AIRDROP_CONFIG.ENABLE_DEBUG_LOGS) {
    console.log('🔧 Airdrop Configuration:', {
      network: AIRDROP_CONFIG.NETWORK,
      programId: AIRDROP_CONFIG.AIRDROP_PROGRAM_ID,
      minBalance: AIRDROP_CONFIG.MIN_SOL_BALANCE,
      hasPrivateKey: !!AIRDROP_CONFIG.PRIVATE_KEY,
    })
  }
}
