import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'

// Solana RPC connection instance
let connection: Connection | null = null

// Initialize connection to Solana blockchain
export function initializeConnection(): Connection {
  const rpcUrl = import.meta.env.VITE_SOLANA_RPC_URL

  if (!rpcUrl) {
    throw new Error(
      'Missing Solana RPC URL. Set VITE_SOLANA_RPC_URL in .env file. ' +
        'Use a Solana RPC endpoint like https://api.mainnet-beta.solana.com',
    )
  }

  // Validate that we're using a Solana RPC endpoint, not Phantom API
  if (rpcUrl.includes('api.phantom.app')) {
    throw new Error(
      'Invalid RPC URL: Use a Solana RPC endpoint, not Phantom API. ' + 'Example: https://api.mainnet-beta.solana.com',
    )
  }

  connection = new Connection(rpcUrl, 'confirmed')
  console.log('Solana RPC connected')
  return connection
}

// Get or create Solana connection
export function getConnection(): Connection {
  if (!connection) {
    return initializeConnection()
  }
  return connection
}

// Fetch SOL balance for a given address (queries blockchain directly)
export async function getBalance(address: string): Promise<number> {
  try {
    const conn = getConnection()
    const publicKey = new PublicKey(address)
    const balanceInLamports = await conn.getBalance(publicKey)
    // Convert lamports to SOL
    return balanceInLamports / LAMPORTS_PER_SOL
  } catch (error) {
    console.error('Balance fetch failed:', error)
    throw new Error('Failed to fetch balance. Check your RPC connection.')
  }
}

// Truncate address for display (e.g., "7xKX...gAsU")
export function truncateAddress(address: string, prefixLength: number = 4, suffixLength: number = 4): string {
  if (address.length <= prefixLength + suffixLength) {
    return address
  }
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`
}

// Format balance with fixed decimal places
export function formatBalance(balance: number, decimals: number = 4): string {
  return balance.toFixed(decimals)
}

// Validate if string is a valid Solana address
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address)
    return true
  } catch (error) {
    return false
  }
}

// Copy text to clipboard
export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text)
    console.log('Copied to clipboard')
  } catch (error) {
    console.error('Copy failed:', error)
    throw new Error('Failed to copy to clipboard')
  }
}

// Generate Solana Explorer URL for an address
export function getExplorerUrl(address: string, cluster: string = 'mainnet-beta'): string {
  const clusterParam = cluster === 'mainnet-beta' ? '' : `?cluster=${cluster}`
  return `https://explorer.solana.com/address/${address}${clusterParam}`
}
