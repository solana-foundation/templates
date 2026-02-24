/**
 * Type definitions for Privy authentication and user objects
 * Based on @privy-io/react-auth SDK
 */

/**
 * Privy User object containing all user identity information
 */
export interface PrivyUser {
  id: string;
  createdAt: number;
  
  // Linked accounts
  email?: {
    address: string;
    verified: boolean;
  };
  
  google?: {
    email: string;
    name?: string;
    subject: string;
  };
  
  twitter?: {
    username: string;
    subject: string;
  };
  
  discord?: {
    username: string;
    subject: string;
  };
  
  github?: {
    username: string;
    subject: string;
  };
  
  linkedin?: {
    email?: string;
    name?: string;
    subject: string;
  };
  
  // Wallet accounts
  linkedAccounts: LinkedAccount[];
}

/**
 * Linked wallet account
 */
export interface LinkedAccount {
  type: "wallet" | "email" | "google" | "twitter" | "discord" | "github" | "linkedin";
  address?: string;
  chainType?: "ethereum" | "solana";
  walletClient?: string;
  walletClientType?: "privy" | "metamask" | "phantom" | "coinbase_wallet";
  connectorType?: string;
  verified: boolean;
  firstVerifiedAt: number | null;
  latestVerifiedAt: number | null;
}

/**
 * Privy wallet object from useWallets hook
 */
export interface PrivyWallet {
  address: string;
  chainType: "ethereum" | "solana";
  walletClient: string;
  walletClientType: "privy" | "metamask" | "phantom" | "coinbase_wallet" | string;
  connectorType?: string;
}

/**
 * Privy authentication state
 */
export interface PrivyAuthState {
  ready: boolean;
  authenticated: boolean;
  user: PrivyUser | null;
}

/**
 * Privy embedded wallet configuration
 */
export interface PrivyEmbeddedWalletConfig {
  createOnLogin?: "off" | "all-users" | "users-without-wallets";
  requireUserPasswordOnCreate?: boolean;
  noPromptOnSignature?: boolean;
}

/**
 * Privy login method types
 */
export type PrivyLoginMethod = 
  | "email" 
  | "sms" 
  | "wallet" 
  | "google" 
  | "twitter" 
  | "discord" 
  | "github" 
  | "linkedin"
  | "apple";

/**
 * Privy appearance theme
 */
export type PrivyTheme = "light" | "dark";

/**
 * Privy configuration
 */
export interface PrivyConfig {
  loginMethods?: PrivyLoginMethod[];
  appearance?: {
    theme?: PrivyTheme;
    accentColor?: string;
    logo?: string;
  };
  embeddedWallets?: PrivyEmbeddedWalletConfig;
  defaultChain?: {
    id: number;
    name: string;
    network: string;
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
    rpcUrls: {
      default: { http: string[] };
      public: { http: string[] };
    };
  };
}
