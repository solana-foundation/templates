/**
 * Type definitions for Privy user objects and sessions
 * 
 * These types extend the types provided by @privy-io/react-auth
 * and provide additional type safety for common use cases.
 */

import type { User } from "@privy-io/react-auth";

/**
 * Extended user type with commonly accessed properties
 */
export type PrivyUser = User;

/**
 * Social login account types
 */
export type SocialAccount = 
  | { type: "google"; email?: string; name?: string }
  | { type: "twitter"; username: string }
  | { type: "discord"; username: string }
  | { type: "email"; address: string }
  | { type: "phone"; number: string };

/**
 * Solana wallet information
 */
export interface SolanaWalletInfo {
  address: string;
  walletClientType: "privy" | "external";
  chainId: string;
}

