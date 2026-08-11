// Types for the MoneyGram Ramps web SDK (loaded from the widget origin as a global).
// Mirrors the shapes documented in the MoneyGram web integration guide.

export interface RampsWallet {
  address: string;
  chain: "solana";
  asset: "USDC";
  walletType: "custodial" | "non-custodial";
  displayName?: string;
}

export interface OnChainTransaction {
  chain: string;
  to: string;
  amount: string;
  asset: string;
  requiredNetwork?: "mainnet" | "testnet";
  tokenAddress?: string;
  tokenDecimals?: number;
  memo?: string;
  rawTransaction: unknown;
}

export interface TransactionRecord {
  id: string;
  type: "off-ramp" | "on-ramp";
  status: string;
  chain: string;
  asset: string;
  walletAddress: string;
  amount: number;
  referenceNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RampsConfig {
  container: HTMLElement;
  sessionToken: string;
  widgetUrl?: string;
  wallet?: RampsWallet;
  transaction?: {
    type: "off-ramp" | "on-ramp";
    asset?: "USDC";
    amount?: number;
    destinationCountry?: string;
    destinationCurrency?: string;
    destinationSubdivision?: string;
  };
  viewTransaction?: {
    id: string;
  };
  theme?: "dark" | "light";
  onSignTransaction?: (tx: OnChainTransaction) => Promise<string>;
  onReady?: () => void;
  onComplete?: (transaction: TransactionRecord) => void;
  onError?: (error: { transactionId?: string; reason: string }) => void;
  onClose?: () => void;
}

export interface RampsInstance {
  open(): void;
  close(): void;
  destroy(): void;
}

export type CreateRamps = (config: RampsConfig) => RampsInstance;

export interface SessionResponse {
  sessionToken: string;
  sessionId: string;
  widgetUrl: string;
}

declare global {
  interface Window {
    RampsSDK?: { createRamps: CreateRamps };
  }
}
