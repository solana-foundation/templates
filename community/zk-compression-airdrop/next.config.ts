import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  env: {
    // NEXT_PUBLIC_RPC_ENDPOINT is inlined automatically by Next, only DEV_WALLET
    // needs an explicit mapping here. Both end up in the browser bundle: this is a
    // devnet-only demo where the browser signs, never use mainnet credentials.
    DEV_WALLET: process.env.DEV_WALLET,
  },
}

export default nextConfig
