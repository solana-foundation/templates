import type { NextConfig } from 'next'
import path from 'node:path'

const backendUrl = process.env.NEXT_PUBLIC_ACTIONS_API ?? 'http://localhost:3001'

const nextConfig: NextConfig = {
  // This frontend installs standalone (run `pnpm install --ignore-workspace`
  // in this dir when working inside the templates monorepo), not as a
  // workspace member, but the repo root also has a pnpm-workspace.yaml.
  // Pin the Turbopack root here so Next doesn't guess wrong and warn.
  turbopack: {
    root: path.join(__dirname),
  },
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
