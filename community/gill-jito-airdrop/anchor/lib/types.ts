import type { Address, TransactionSigner } from 'gill'

export interface GillWalletInfo {
  name: string
  address: Address
  keypairFile: string
  privateKey: {
    hex: string
    base58: string
    array: number[]
  }
  secretKey: {
    hex: string
    base58: string
    array: number[]
  }
  balance?: string
  funded?: boolean
  seedPhrase?: string
  isDeployWallet?: boolean
  signer?: TransactionSigner // Optional signer for transactions
}

export interface GillRecipient {
  recipient: Address
  amount: number
}

export interface GillNetworkConfig {
  network: 'devnet' | 'testnet' | 'mainnet-beta' | string
  rpcUrl?: string
  wsUrl?: string
}

export interface GillTransactionResult {
  success: boolean
  signature?: string
  error?: string
}

export interface GillDeploymentResult {
  success: boolean
  programId?: Address
  signature?: string
  error?: string
}

export interface GillInitializationResult {
  success: boolean
  airdropStatePda?: Address
  signature?: string
  alreadyInitialized?: boolean
  verificationFailed?: boolean
  error?: string
}

export interface RecipientFromJson {
  publicKey: string
  amount: string
  index: number
  description: string
}

export interface RecipientsFile {
  airdropId: string
  description: string
  merkleRoot: string
  totalAmount: string
  network: string
  programId: string
  recipients: RecipientFromJson[]
  metadata: {
    createdAt: string
    version: string
    algorithm: string
    leafFormat: string
  }
}

export interface TestWalletsData {
  network: string
  description: string
  createdAt: string
  wallets: {
    name: string
    publicKey: string
    keypairFile: string
    privateKey: {
      hex: string
      base58: string
      array: number[]
    }
    secretKey: {
      hex: string
      base58: string
      array: number[]
    }
    balance?: string
    funded?: boolean
    seedPhrase?: string
    isDeployWallet?: boolean
  }[]
  usage: {
    description: string
    loadWallet: string
    checkBalance: string
    fundWallet: string
    transferFunds: string
    privateKeyFormats: {
      hex: string
      base58: string
      array: string
    }
    security: {
      warning: string
      note: string
    }
  }
}
