import { X402_CONFIG } from './x402-config'

export function buildPaymentHeader(params: {
  signature: string
  from: string
  to: string
  amount: string
  token: string
}): string {
  const paymentData = {
    x402Version: 1,
    scheme: X402_CONFIG.PAYMENT_SCHEME,
    network: X402_CONFIG.NETWORK,
    payload: {
      signature: params.signature,
      from: params.from,
      to: params.to,
      amount: params.amount,
      token: params.token,
    },
  }

  return JSON.stringify(paymentData)
}

