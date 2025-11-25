import express from 'express'
import { Network, paymentMiddleware, SolanaAddress } from 'x402-express'
import { config } from 'dotenv'
import path from 'path'

config({ path: path.join(process.cwd(), '..', '.env') })

type Resource = `${string}://${string}`

const API_PORT = process.env.API_PORT || 4021
const FACILITATOR_URL = (process.env.FACILITATOR_URL as Resource) || 'http://localhost:3000'
const NETWORK = (process.env.NETWORK || 'solana') as Network
const PAYOUT_RECIPIENT_ADDRESS = process.env.PAYOUT_RECIPIENT_ADDRESS as SolanaAddress

if (!PAYOUT_RECIPIENT_ADDRESS) {
  throw new Error('PAYOUT_RECIPIENT_ADDRESS is not set')
}

const app = express()

app.use(
  paymentMiddleware(
    PAYOUT_RECIPIENT_ADDRESS,
    {
      'GET /protected': {
        price: '$0.0001',
        network: NETWORK,
      },
    },
    {
      url: FACILITATOR_URL,
    },
  ),
)

app.get('/protected', (req, res) => {
  res.json({
    message: 'Protected endpoint accessed successfully',
    timestamp: new Date().toISOString(),
  })
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(API_PORT, () => {
  console.log(`Server listening at http://localhost:${API_PORT}`)
})

// curl -X GET http://localhost:4021/protected
// curl -X GET http://localhost:4021/health
