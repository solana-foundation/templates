import { NextResponse } from 'next/server'
import { withX402 } from '@x402/next'
import { network, payTo, paywall, server } from '@/proxy'

const handler = async () => NextResponse.json({ fact: 'A group of cats is called a clowder.' })

// withX402 settles the payment only after the handler returns a successful response (status < 400)
export const GET = withX402(
  handler,
  {
    accepts: { scheme: 'exact', price: '$0.01', network, payTo },
    description: 'Access to a premium cat fact',
    mimeType: 'application/json',
  },
  server,
  undefined, // paywallConfig: already set on the paywall in proxy.ts
  paywall,
)
