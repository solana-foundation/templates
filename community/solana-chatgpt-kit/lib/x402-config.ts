import { X402PaymentHandler } from 'x402-solana/server'

// Initialize x402 Payment Handler for mainnet
export function getX402Handler(): X402PaymentHandler {
  const treasuryAddress = process.env.X402_TREASURY_ADDRESS
  const facilitatorUrl = process.env.FACILITATOR_URL || 'https://facilitator.payai.network'

  if (!treasuryAddress) {
    throw new Error('X402_TREASURY_ADDRESS not found in environment variables')
  }

  const rpcUrl = 'https://api.mainnet-beta.solana.com'
  console.log(`🔧 x402 Config: treasury=${treasuryAddress}, facilitator=${facilitatorUrl}, rpcUrl=${rpcUrl}`)

  const handler = new X402PaymentHandler({
    network: 'solana', // mainnet
    treasuryAddress,
    facilitatorUrl,
    rpcUrl,
  })

  console.log('✅ x402 Payment Handler created')
  return handler
}

// Payment configuration constants
export const X402_FEE_CONFIG = {
  amount: '1000', // 0.001 USDC in micro-units (6 decimals)
  solAsset: {
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC mainnet
    decimals: 6, // USDC has 6 decimals
  },
  network: 'solana' as const, // mainnet
  description: 'API Transfer Fee - $0.001 USDC',
} as const
