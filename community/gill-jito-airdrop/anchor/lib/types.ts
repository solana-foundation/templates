// Common types used across the deployment system

export interface WalletInfo {
  name: string;
  publicKey: string;
  keypairFile: string;
  privateKey: {
    hex: string;
    base58: string;
    array: number[];
  };
  secretKey: {
    hex: string;
    base58: string;
    array: number[];
  };
  balance?: string;
  funded?: boolean;
  seedPhrase?: string;
  isDeployWallet?: boolean;
}

export interface Recipient {
  recipient: import("@solana/web3.js").PublicKey;
  amount: number;
}

export interface RecipientFromJson {
  publicKey: string;
  amount: string;
  index: number;
  description: string;
}

export interface RecipientsFile {
  airdropId: string;
  description: string;
  merkleRoot: string;
  totalAmount: string;
  network: string;
  programId: string;
  recipients: RecipientFromJson[];
  metadata: {
    createdAt: string;
    version: string;
    algorithm: string;
    leafFormat: string;
  };
}

export interface TestWalletsData {
  network: string;
  description: string;
  createdAt: string;
  wallets: WalletInfo[];
  usage: {
    description: string;
    loadWallet: string;
    checkBalance: string;
    fundWallet: string;
    transferFunds: string;
    privateKeyFormats: {
      hex: string;
      base58: string;
      array: string;
    };
    security: {
      warning: string;
      note: string;
    };
  };
}

export interface BuildResult {
  success: boolean;
  programId?: string;
  error?: string;
}

export interface DeploymentResult {
  success: boolean;
  programId?: string;
  signature?: string;
  error?: string;
}

export interface InitializationResult {
  success: boolean;
  airdropStatePda?: string;
  signature?: string;
  alreadyInitialized?: boolean;
  verificationFailed?: boolean;
  error?: string;
}