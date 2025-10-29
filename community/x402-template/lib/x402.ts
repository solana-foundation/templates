export function buildPaymentHeader(params: {
  signature: string
  from: string
  to: string
  amount: string
  token: string
  network: string
}): string {
  const paymentData = {
    x402Version: 1,
    scheme: 'exact',
    network: params.network,
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

