import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export', // Static site generation for Permaweb
  trailingSlash: true, // Better routing on Arweave
  images: {
    unoptimized: true, // Required for static export
  },
}

export default nextConfig
