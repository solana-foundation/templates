/** Represents a linked account from Privy's user object */
export type LinkedAccountType =
  | "email"
  | "phone"
  | "google_oauth"
  | "twitter_oauth"
  | "discord_oauth"
  | "github_oauth"
  | "wallet";

/** Simplified linked account for display purposes */
export interface LinkedAccount {
  type: LinkedAccountType;
  /** Display-friendly label (email address, username, wallet address, etc.) */
  identifier: string;
  /** When this account was first linked */
  firstVerifiedAt: Date | null;
  /** Latest verification timestamp */
  latestVerifiedAt: Date | null;
}

/** Auth status states used throughout the app */
export type AuthState = "loading" | "authenticated" | "unauthenticated";

/** Solana wallet info extracted from Privy */
export interface SolanaWalletInfo {
  address: string;
  /** Whether this is a Privy-managed embedded wallet */
  isEmbedded: boolean;
}

/** User session data aggregated from Privy */
export interface UserSession {
  /** Privy's internal user ID */
  userId: string;
  /** Timestamp of account creation */
  createdAt: Date;
  /** All linked accounts */
  linkedAccounts: LinkedAccount[];
  /** Solana wallets associated with the user */
  solanaWallets: SolanaWalletInfo[];
}
