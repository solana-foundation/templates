export interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
}

export interface QuoteResponse {
  inputMint: string
  inAmount: string
  outputMint: string
  outAmount: string
  otherAmountThreshold: string
  swapMode: string
  slippageBps: number
  platformFee?: any
  priceImpactPct: string
  routePlan: RoutePlan[]
}

export interface RoutePlan {
  swapInfo: SwapInfo
  percent: number
}

export interface SwapInfo {
  ammKey: string
  label: string
  inputMint: string
  inAmount: string
  outputMint: string
  outAmount: string
  feeAmount: string
  feeMint: string
}
