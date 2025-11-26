import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer, createExpressMiddleware } from 'spl402'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
    exposedHeaders: ['X-Payment-Required'],
  }),
)

app.use(express.json())

const NETWORK = process.env.SOLANA_NETWORK as 'mainnet-beta' | 'devnet' || 'devnet'
const DEFAULT_RPC_URL = NETWORK === 'mainnet-beta'
  ? 'https://api.mainnet-beta.solana.com'
  : 'https://api.devnet.solana.com'

const ROUTES = [
  { path: '/api/free-data', price: 0 },
  { path: '/api/premium-data', price: 0.001 },
  { path: '/api/ultra-premium', price: 0.005 },
  { path: '/api/enterprise-data', price: 0.01 },
]

const spl402 = createServer({
  network: NETWORK,
  recipientAddress: process.env.RECIPIENT_WALLET as string,
  rpcUrl: process.env.SOLANA_RPC_URL || DEFAULT_RPC_URL,
  routes: ROUTES,
})

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    network: NETWORK,
    recipient: process.env.RECIPIENT_WALLET,
  })
})

app.use(createExpressMiddleware(spl402))

app.get('/api/free-data', (_req: Request, res: Response) => {
  res.json({
    message: 'This is free data',
    timestamp: new Date().toISOString(),
    tier: 'free',
  })
})

app.get('/api/premium-data', (_req: Request, res: Response) => {
  res.json({
    message: 'Welcome to premium tier!',
    data: {
      secret: 'This data costs 0.001 SOL',
      features: ['Advanced analytics', 'Real-time updates', 'Priority support'],
      timestamp: new Date().toISOString(),
    },
    tier: 'premium',
  })
})

app.get('/api/ultra-premium', (_req: Request, res: Response) => {
  res.json({
    message: 'Ultra premium content unlocked!',
    data: {
      secret: 'This exclusive data costs 0.005 SOL',
      features: [
        'Advanced analytics',
        'Real-time updates',
        'Priority support',
        'Dedicated account manager',
        'Custom integrations',
      ],
      insights: {
        market_analysis: 'Bullish trend detected',
        recommendation: 'Strong buy',
        confidence: 0.95,
      },
      timestamp: new Date().toISOString(),
    },
    tier: 'ultra-premium',
  })
})

app.get('/api/enterprise-data', (_req: Request, res: Response) => {
  res.json({
    message: 'Enterprise tier activated!',
    data: {
      secret: 'Top-tier enterprise data costs 0.01 SOL',
      features: [
        'All premium features',
        'White-label solution',
        'Custom SLA',
        '24/7 dedicated support',
        'Advanced security features',
        'API rate limit: Unlimited',
      ],
      enterprise_insights: {
        market_depth: 'Complete order book analysis',
        trading_signals: ['BUY', 'HOLD', 'ACCUMULATE'],
        risk_score: 0.15,
        recommended_position: '15% portfolio allocation',
      },
      timestamp: new Date().toISOString(),
    },
    tier: 'enterprise',
  })
})

app.listen(PORT, () => {
  const endpointLines = ROUTES.map(route => {
    const priceDisplay = route.price === 0 ? 'Free (0 SOL)' : `${route.price} SOL`
    const pathPadded = `GET ${route.path}`.padEnd(30)
    return `║  ${pathPadded} - ${priceDisplay.padEnd(20)} ║`
  }).join('\n')

  console.log(`
╔════════════════════════════════════════════════════════╗
║  SPL-402 Server Template                               ║
╠════════════════════════════════════════════════════════╣
║  Status: Running                                       ║
║  Port: ${PORT.toString().padEnd(45)} ║
║  Network: ${NETWORK.padEnd(42)} ║
║  Recipient: ${(process.env.RECIPIENT_WALLET?.slice(0, 8) + '...').padEnd(38)} ║
╠════════════════════════════════════════════════════════╣
║  Endpoints:                                            ║
${endpointLines}
║  GET /health              - Health check              ║
╚════════════════════════════════════════════════════════╝
  `)
})
