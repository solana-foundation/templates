import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'

/**
 * Solana RPC endpoint
 * Uses environment variable or defaults to mainnet-beta
 */
const RPC_URL = process.env.EXPO_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'

/**
 * Fetches SOL balance for a given wallet address
 * @param address - Solana wallet address (base58 string)
 * @returns Balance in SOL (not lamports)
 * @throws Error if address is invalid or RPC call fails
 */
export async function getBalance(address: string): Promise<number> {
  try {
    const connection = new Connection(RPC_URL)
    const publicKey = new PublicKey(address)
    const balance = await connection.getBalance(publicKey)
    return balance / LAMPORTS_PER_SOL
  } catch (error) {
    console.error('Error fetching balance:', error)
    throw error
  }
}
