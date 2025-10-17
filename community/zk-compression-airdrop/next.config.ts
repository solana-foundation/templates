import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  env: {
    RPC_ENDPOINT: process.env.RPC_ENDPOINT,
    DEV_WALLET: process.env.DEV_WALLET,
  },
}

export default nextConfig
