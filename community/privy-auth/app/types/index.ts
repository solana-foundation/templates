/**
 * Type definitions for Privy user objects and sessions
 * 
 * These types extend the types provided by @privy-io/react-auth
 * and provide additional type safety for common use cases.
 */

import type { User } from "@privy-io/react-auth";

export type PrivyUser = User;

export type SocialAccount = 
  | { type: "google"; email?: string; name?: string }
  | { type: "twitter"; username: string }
  | { type: "discord"; username: string }
  | { type: "email"; address: string }
  | { type: "phone"; number: string };

export interface SolanaWalletInfo {
  address: string;
  walletClientType: "privy" | "external";
  chainId: string;
}

export type SessionClaims = Record<string, unknown> & {
  exp?: number;
  iat?: number;
  aud?: string | string[];
  sid?: string;
  sub?: string;
  jti?: string;
};
