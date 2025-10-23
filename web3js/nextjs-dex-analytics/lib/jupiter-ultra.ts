const JUPITER_ULTRA_API = 'https://lite-api.jup.ag/ultra/v1'
import { track } from '@vercel/analytics'

export interface JupiterOrderParams {
  inputMint: string
  outputMint: string
  amount: string
  taker: string
  slippageBps?: number
  referralAccount?: string
  referralFeeBps?: number
}

export interface JupiterOrderResponse {
  mode: string
  swapType: string
  router: string
  requestId: string
  inAmount: string
  outAmount: string
  otherAmountThreshold: string
  swapMode: string
  slippageBps: number
  priceImpactPct: string
  transaction: string
  routePlan: any[]
  feeBps?: number
  feeMint?: string
}

export interface JupiterExecuteResponse {
  status: 'Success' | 'Failed'
  signature?: string
  slot?: string
  code: number
  inputAmountResult?: string
  outputAmountResult?: string
  error?: string
}

export interface TokenAccount {
  account: string
  amount: string
  uiAmount: number
  uiAmountString: string
  isFrozen: boolean
  isAssociatedTokenAccount: boolean
  decimals: number
  programId: string
  excludeFromNetWorth: boolean
}

export interface HoldingsResponse {
  amount: string
  uiAmount: number
  uiAmountString: string
  tokens: {
    [mint: string]: TokenAccount[]
  }
}

export async function getHoldings(address: string): Promise<HoldingsResponse> {
  const response = await fetch(`${JUPITER_ULTRA_API}/holdings/${address}`)

  if (!response.ok) {
    throw new Error(`Failed to get holdings: ${response.statusText}`)
  }

  return response.json()
}

export async function getJupiterOrder(params: JupiterOrderParams): Promise<JupiterOrderResponse> {
  const referralAccount =
    params.referralAccount ||
    (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_ULTRA_REFERRAL_ACCOUNT : undefined)
  const referralFeeBps =
    params.referralFeeBps ||
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_ULTRA_REFERRAL_FEE_BPS
      ? Number(process.env.NEXT_PUBLIC_ULTRA_REFERRAL_FEE_BPS)
      : undefined)

  const baseParams: Record<string, string> = {
    inputMint: params.inputMint,
    outputMint: params.outputMint,
    amount: params.amount,
    taker: params.taker,
  }

  if (params.slippageBps !== undefined) {
    baseParams.slippageBps = params.slippageBps.toString()
  }

  if (referralAccount) {
    baseParams.referralAccount = referralAccount
  }

  if (referralFeeBps !== undefined) {
    baseParams.referralFee = referralFeeBps.toString()
  }

  const queryParams = new URLSearchParams(baseParams)

  try {
    track('ultra_order_request', {
      inputMint: params.inputMint,
      outputMint: params.outputMint,
      amount: params.amount,
      taker: params.taker,
      slippageBps: params.slippageBps ?? null,
      hasReferralAccount: Boolean(referralAccount),
      referralFeeBps: referralFeeBps ?? null,
    })
  } catch {}

  const response = await fetch(`${JUPITER_ULTRA_API}/order?${queryParams}`)

  if (!response.ok) {
    const errorText = await response.text()
    try {
      track('ultra_order_error', {
        status: response.status,
        statusText: response.statusText,
        inputMint: params.inputMint,
        outputMint: params.outputMint,
        amount: params.amount,
      })
    } catch {}
    throw new Error(`Failed to get Jupiter order: ${response.statusText} - ${errorText}`)
  }

  const json = (await response.json()) as JupiterOrderResponse
  try {
    track('ultra_order_success', {
      requestId: json.requestId,
      inAmount: json.inAmount,
      outAmount: json.outAmount,
      feeBps: (json as any).feeBps ?? json.feeBps ?? null,
      feeMint: (json as any).feeMint ?? json.feeMint ?? null,
    })
  } catch {}
  return json
}

export async function executeJupiterOrder(
  signedTransaction: string,
  requestId: string,
): Promise<JupiterExecuteResponse> {
  try {
    track('ultra_execute_attempt', { requestId })
  } catch {}

  const response = await fetch(`${JUPITER_ULTRA_API}/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      signedTransaction,
      requestId,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    try {
      track('ultra_execute_error', { requestId, status: response.status, statusText: response.statusText })
    } catch {}
    throw new Error(`Failed to execute Jupiter order: ${response.statusText} - ${errorText}`)
  }

  const json = (await response.json()) as JupiterExecuteResponse
  try {
    track('ultra_execute_result', { requestId, status: json.status, signature: json.signature ?? null })
  } catch {}
  return json
}
