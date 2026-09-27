import { paymentProxy } from '@x402/next'
import { HTTPFacilitatorClient, x402ResourceServer } from '@x402/core/server'
import type { Network } from '@x402/core/types'
import { SOLANA_DEVNET_CAIP2, SOLANA_MAINNET_CAIP2 } from '@x402/svm'
import { registerExactSvmScheme } from '@x402/svm/exact/server'
import { createPaywall } from '@x402/paywall'
import { svmPaywall } from '@x402/paywall/svm'

const receiverAddress = process.env.NEXT_PUBLIC_RECEIVER_ADDRESS
if (!receiverAddress) {
  throw new Error(
    'NEXT_PUBLIC_RECEIVER_ADDRESS is not set. Copy .env.example to .env.local and set your Solana address.',
  )
}
export const payTo = receiverAddress
// x402 v2 identifies networks by CAIP-2 id
export const network = (process.env.NEXT_PUBLIC_NETWORK || SOLANA_DEVNET_CAIP2) as Network
if (network !== SOLANA_DEVNET_CAIP2 && network !== SOLANA_MAINNET_CAIP2) {
  throw new Error(
    `NEXT_PUBLIC_NETWORK must be a Solana CAIP-2 id: ${SOLANA_DEVNET_CAIP2} (devnet) or ${SOLANA_MAINNET_CAIP2} (mainnet).`,
  )
}
const facilitatorUrl = process.env.NEXT_PUBLIC_FACILITATOR_URL || 'https://x402.org/facilitator'

export const server = new x402ResourceServer(new HTTPFacilitatorClient({ url: facilitatorUrl }))
registerExactSvmScheme(server)

export const paywall = createPaywall()
  .withNetwork(svmPaywall)
  .withConfig({
    appName: 'x402 Demo',
    testnet: network === SOLANA_DEVNET_CAIP2,
  })
  .build()

export const proxy = paymentProxy(
  {
    '/content/cheap': {
      accepts: { scheme: 'exact', price: '$0.01', network, payTo },
      description: 'Access to cheap content',
      mimeType: 'text/html',
    },
    '/content/expensive': {
      accepts: { scheme: 'exact', price: '$0.25', network, payTo },
      description: 'Access to expensive content',
      mimeType: 'text/html',
    },
  },
  server,
  undefined, // paywallConfig: already set on the paywall above
  paywall,
)

// Configure which paths the proxy should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/', // Include the root path explicitly
  ],
}
