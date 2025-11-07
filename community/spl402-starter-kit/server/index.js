import express from 'express'
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

const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: process.env.RECIPIENT_WALLET,
  rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  routes: [
    { path: '/api/free-data', price: 0 },
    { path: '/api/premium-data', price: 0.001 },
    { path: '/api/ultra-premium', price: 0.005 },
    { path: '/api/enterprise-data', price: 0.01 },
  ],
})

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    network: 'mainnet-beta',
    recipient: process.env.RECIPIENT_WALLET,
  })
})

app.use(createExpressMiddleware(spl402))

app.get('/api/free-data', (req, res) => {
  res.json({
    message: 'This is free data',
    timestamp: new Date().toISOString(),
    tier: 'free',
  })
})

app.get('/api/premium-data', (req, res) => {
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

app.get('/api/ultra-premium', (req, res) => {
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

app.get('/api/enterprise-data', (req, res) => {
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
  console.log(`
╔════════════════════════════════════════════════════════╗
║  SPL-402 Server Template                               ║
╠════════════════════════════════════════════════════════╣
║  Status: Running                                       ║
║  Port: ${PORT}                                         ║
║  Network: mainnet-beta                                 ║
║  Recipient: ${process.env.RECIPIENT_WALLET?.slice(0, 8)}...  ║
╠════════════════════════════════════════════════════════╣
║  Endpoints:                                            ║
║  GET /api/free-data       - Free (0 SOL)              ║
║  GET /api/premium-data    - 0.001 SOL                 ║
║  GET /api/ultra-premium   - 0.005 SOL                 ║
║  GET /api/enterprise-data - 0.01 SOL                  ║
║  GET /health              - Health check              ║
╚════════════════════════════════════════════════════════╝
  `)
})
