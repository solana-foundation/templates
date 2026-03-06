import type { User } from "@privy-io/react-auth";

export type PrivyUser = User;

export interface PrivyWallet {
  address: string;
  chainType: "solana" | "ethereum";
  walletClientType: "privy";
  connectorType: "embedded";
  imported: boolean;
  delegated: boolean;
}

export interface LinkedAccount {
  type: "google" | "discord" | "twitter" | "email" | "wallet";
  address?: string;
  email?: string;
  username?: string;
  subject?: string;
}

export type AuthenticationStatus = "loading" | "authenticated" | "unauthenticated";

export interface PrivySession {
  user: PrivyUser;
  authenticated: boolean;
  ready: boolean;
}

export interface WalletConnectionState {
  isConnected: boolean;
  address: string | null;
  chainType: "solana" | "ethereum" | null;
  isEmbedded: boolean;
}
