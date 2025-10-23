export interface AirdropRecipient {
  recipient: string
  amount: string
  index: number
}

export interface AirdropConfig {
  mintAddress: string
  authority: string
  decimals: number
  name: string
  symbol: string
  network: string
}

export interface AirdropData {
  mint: string
  decimals: number
  totalRecipients: number
  totalAmount: string
  recipients: AirdropRecipient[]
  generatedAt: string
}

export interface AirdropProgress {
  currentBatch: number
  totalBatches: number
  successfulMints: number
  failedMints: number
  signatures: string[]
}
