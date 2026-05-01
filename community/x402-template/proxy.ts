import { paymentProxy, type Network } from '@x402/next'
import { HTTPFacilitatorClient, x402ResourceServer } from '@x402/core/server'
import { registerExactSvmScheme } from '@x402/svm/exact/server'

const payTo = process.env.NEXT_PUBLIC_RECEIVER_ADDRESS
const network = process.env.NEXT_PUBLIC_NETWORK as Network | undefined
const facilitatorUrl = process.env.NEXT_PUBLIC_FACILITATOR_URL

if (!payTo || !network || !facilitatorUrl) {
  throw new Error(
    'Missing required x402 env vars: NEXT_PUBLIC_RECEIVER_ADDRESS, NEXT_PUBLIC_NETWORK, NEXT_PUBLIC_FACILITATOR_URL',
  )
}

const facilitatorClient = new HTTPFacilitatorClient({ url: facilitatorUrl })
const server = new x402ResourceServer(facilitatorClient)

registerExactSvmScheme(server)

export const proxy = paymentProxy(
  {
    '/content/cheap': {
      accepts: [
        {
          scheme: 'exact',
          price: '$0.01',
          network,
          payTo,
        },
      ],
      description: 'Access to cheap content',
      mimeType: 'text/html',
    },
    '/content/expensive': {
      accepts: [
        {
          scheme: 'exact',
          price: '$0.25',
          network,
          payTo,
        },
      ],
      description: 'Access to expensive content',
      mimeType: 'text/html',
    },
  },
  server,
)

// Configure which paths the proxy should run on
export const config = {
  matcher: ['/content/:path*'],
}
