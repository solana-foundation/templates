import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Get RPC URL from environment or use default mainnet-beta
const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

/**
 * Fetches the SOL balance for a given Solana address
 * @param address - The Solana wallet address as a string
 * @returns The balance in SOL (converted from lamports)
 */
export async function getBalance(address: string): Promise<number> {
  try {
    // Create connection to Solana RPC
    const connection = new Connection(RPC_URL);
    
    // Convert address string to PublicKey
    const publicKey = new PublicKey(address);
    
    // Fetch balance in lamports
    const balance = await connection.getBalance(publicKey);
    
    // Convert lamports to SOL
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw error;
  }
}

