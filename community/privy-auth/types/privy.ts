/**
 * Type definitions for Privy authentication state and user objects.
 * These types help with TypeScript intellisense when working with
 * Privy's usePrivy() and useWallets() hooks.
 */

/** Supported login methods in this template */
export type LoginMethod = 'email' | 'google' | 'twitter' | 'discord' | 'github' | 'wallet'

/** Authentication state of the current user */
export type AuthState = 'loading' | 'authenticated' | 'unauthenticated'

/** Linked account types from Privy user object */
export interface LinkedEmail {
  type: 'email'
  address: string
}

export interface LinkedGoogle {
  type: 'google_oauth'
  email: string
  name?: string
  profilePictureUrl?: string
}

export interface LinkedTwitter {
  type: 'twitter_oauth'
  username: string
  name?: string
  profilePictureUrl?: string
}

export interface LinkedDiscord {
  type: 'discord_oauth'
  username: string
  email?: string
}

export interface LinkedGithub {
  type: 'github_oauth'
  username: string
  name?: string
  email?: string
}

export interface LinkedWallet {
  type: 'wallet'
  address: string
  chainType: 'ethereum' | 'solana'
}

export type LinkedAccount = LinkedEmail | LinkedGoogle | LinkedTwitter | LinkedDiscord | LinkedGithub | LinkedWallet

/** Solana wallet info for display */
export interface SolanaWalletInfo {
  address: string
  isEmbedded: boolean
  balance?: number
}
