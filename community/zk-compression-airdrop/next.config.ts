import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  env: {
    // DEV_WALLET is a throwaway devnet keypair that the browser uses to sign.
    // It IS embedded in the client bundle: never put a mainnet key here.
    DEV_WALLET: process.env.DEV_WALLET,
  },
  // The client talks to /api/rpc and this rewrite forwards it to the real endpoint
  // on the server, so the Helius api-key in RPC_ENDPOINT never reaches the browser.
  // The fallback keeps the app booting without env, though compression calls need
  // a Photon-capable endpoint (Helius) to actually work.
  async rewrites() {
    return [
      {
        source: '/api/rpc',
        destination: process.env.RPC_ENDPOINT ?? 'https://api.devnet.solana.com',
      },
    ]
  },
}

export default nextConfig
