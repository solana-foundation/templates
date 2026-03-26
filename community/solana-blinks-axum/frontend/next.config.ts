import type { NextConfig } from 'next'

const backendUrl = process.env.NEXT_PUBLIC_ACTIONS_API ?? 'http://localhost:3001'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/actions/:path*',
        destination: `${backendUrl}/api/actions/:path*`,
      },
      {
        source: '/actions.json',
        destination: `${backendUrl}/actions.json`,
      },
    ]
  },
}

export default nextConfig
