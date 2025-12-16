import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  env: {
    SOLANA_RPC_URL: process.env.SOLANA_RPC_URL,
  },
}

export default nextConfig
