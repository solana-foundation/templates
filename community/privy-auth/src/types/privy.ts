import type {
  User,
  LinkedAccountWithMetadata,
  WalletWithMetadata,
} from "@privy-io/react-auth";

/** Re-export Privy's types for convenience */
export type { User, LinkedAccountWithMetadata, WalletWithMetadata };

/** Session state derived from usePrivy */
export interface PrivySession {
  userId: string;
  isAuthenticated: boolean;
  isReady: boolean;
}

/** Check if a linked account is a wallet */
export function isWalletAccount(
  account: LinkedAccountWithMetadata,
): account is WalletWithMetadata {
  return account.type === "wallet";
}

/** Check if a wallet-type linked account is a Solana wallet */
export function isSolanaWallet(
  account: LinkedAccountWithMetadata,
): account is WalletWithMetadata {
  return account.type === "wallet" && (account as WalletWithMetadata).chainType === "solana";
}

/** Check if a wallet-type linked account is a Privy embedded wallet */
export function isEmbeddedWallet(
  account: LinkedAccountWithMetadata,
): boolean {
  return (
    account.type === "wallet" &&
    (account as WalletWithMetadata).walletClientType === "privy"
  );
}
