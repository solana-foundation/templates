import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: [
    '@solana-commerce/react',
    '@solana-commerce/connector',
    '@solana-commerce/headless',
    '@solana-commerce/solana-pay',
    '@solana-commerce/sdk',
  ],
}

export default nextConfig
