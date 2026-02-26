/**
 * Privy auth type definitions for the template.
 * Standalone interfaces scoped to what the template uses.
 * These are NOT wrappers around Privy SDK types.
 */

/** Summary of the authenticated Privy user */
export interface PrivyUserSummary {
  /** Privy DID (decentralized identifier) */
  id: string
  /** Account creation timestamp (ISO 8601) */
  createdAt: string
  /** Email address from email login */
  email?: string
  /** Google account info */
  google?: { email: string; name: string | null }
  /** GitHub account info */
  github?: { username: string | null }
  /** Twitter/X account info */
  twitter?: { username: string | null }
  /** Primary Solana wallet address (convenience field) */
  walletAddress?: string
}

/** Summary of a Solana wallet */
export interface WalletSummary {
  /** Solana public key (base58) */
  address: string
  /** Wallet client type (e.g., 'privy') */
  walletClientType: string
  /** Whether this is a Privy embedded wallet */
  isEmbedded: boolean
}

/** Current authentication session state */
export interface SessionInfo {
  /** Whether the user is authenticated */
  authenticated: boolean
  /** Whether the Privy client has finished initializing */
  ready: boolean
}
