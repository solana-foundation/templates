import express from 'express'
import cors from 'cors'

import { errorResponse, successResponse } from './lib/api-response-helpers.js'
import { getApiConfig } from './lib/get-api-config.js'
import { getApiContext } from './lib/get-api-context.js'
import { getSolanaBalance } from './lib/get-solana-balance.js'
import { getSolanaCachedBlockhash } from './lib/get-solana-cached-blockhash.js'
import { getSolanaCluster } from './lib/get-solana-cluster.js'

const app = express()
const { port, ...config } = getApiConfig()
const context = await getApiContext()

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || config.corsOrigins.includes(origin)) {
        return cb(null, true)
      }
      cb(new Error('Not allowed by CORS'))
    },
  }),
)

app.get('/', (req, res) => {
  res.json(successResponse({ message: 'Gm! Welcome to Scaffold!' }))
})

app.get('/balance/:address', async (req, res) => {
  try {
    const balance = await getSolanaBalance(context, req.params.address)
    if (!balance) {
      context.log.error(`Failed to retrieve balance for address: ${req.params.address}`)
      res.status(500).json(errorResponse('Balance not retrieved', 'BALANCE_RETRIEVAL_FAILED'))
      return
    }
    res.json(successResponse(balance))
  } catch (error) {
    context.log.error(`Error getting balance for address ${req.params.address}`, error)
    res.status(500).json(errorResponse('Error getting balance', 'BALANCE_ERROR'))
  }
})

app.get('/balance-signer', async (req, res) => {
  try {
    const balance = await getSolanaBalance(context, context.signer.address)
    if (!balance) {
      context.log.error(`Failed to retrieve balance for signer: ${context.signer.address}`)
      res.status(500).json(errorResponse('Balance not retrieved', 'BALANCE_RETRIEVAL_FAILED'))
      return
    }
    res.json(successResponse(balance))
  } catch (error) {
    context.log.error(`Error getting balance for signer ${context.signer.address}`, error)
    res.status(500).json(errorResponse('Error getting balance', 'BALANCE_ERROR'))
  }
})

app.get('/cluster', async (req, res) => {
  try {
    const result = await getSolanaCluster(context)
    if (!result) {
      context.log.error(`Failed to retrieve cluster`)
      res.status(500).json(errorResponse('Cluster not retrieved', 'CLUSTER_RETRIEVAL_FAILED'))
      return
    }
    res.json(successResponse(result))
  } catch (error) {
    context.log.error(`Error getting cluster`, error)
    res.status(500).json(errorResponse('Error getting cluster', 'CLUSTER_ERROR'))
  }
})

app.get('/latest-blockhash', async (req, res) => {
  try {
    const start = Date.now()
    const blockhash = await getSolanaCachedBlockhash(context)

    if (!blockhash) {
      context.log.error(`Failed to retrieve blockhash`)
      res.status(500).json(errorResponse('Blockhash not retrieved', 'BLOCKHASH_RETRIEVAL_FAILED'))
      return
    }

    res.json(
      successResponse({
        ...blockhash,
        ttl: blockhash.cachedAt + 1000 * 30 - Date.now(),
        duration: Date.now() - start + 'ms',
      }),
    )
  } catch (error) {
    context.log.error(`Error getting blockhash`, error)
    res.status(500).json(errorResponse('Error getting blockhash', 'BLOCKHASH_ERROR'))
  }
})

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err.message === 'Not allowed by CORS') {
    context.log.warn(`CORS rejection for origin: ${req.headers.origin}`)
    res.status(403).json(errorResponse('Origin not allowed', 'CORS_FORBIDDEN', 403))
    return
  }

  context.log.error(`Unhandled error: ${err.message}`, err)
  res.status(500).json(errorResponse('An unexpected error occurred', 'UNEXPECTED_ERROR'))
})

app.listen(port, () => {
  context.log.info(`🐠 Listening on http://localhost:${port}`)
  context.log.info(`🐠 Endpoint: ${config.solanaRpcEndpoint.split('?')[0]}`)
  context.log.info(`🐠 Signer  : ${context.signer.address}`)
})

declare global {
  interface BigInt {
    toJSON(): string
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString()
}
