import express from 'express'

import { getApiConfig } from './lib/get-api-config.js'
import { getSolanaBalance } from './lib/get-solana-balance.js'
import { getSolanaCachedBlockhash } from './lib/get-solana-cached-blockhash.js'
import { getSolanaCluster } from './lib/get-solana-cluster.js'
import { getApiContext } from './lib/get-api-context.js'

const app = express()
const { port } = getApiConfig()

app.get('/', (req, res) => {
  res.send('Gm! Welcome to Scaffold!')
})

app.get('/balance/:address', async (req, res) => {
  res.send(await getSolanaBalance(req.params.address))
})

app.get('/balance-signer', async (req, res) => {
  const { signer } = await getApiContext()
  res.send(await getSolanaBalance(signer.address))
})

app.get('/cluster', async (req, res) => {
  res.send(await getSolanaCluster())
})

app.get('/latest-blockhash', async (req, res) => {
  const start = Date.now()
  // Get the cached blockhash
  const blockhash = await getSolanaCachedBlockhash()

  if (!blockhash) {
    res.status(500).send('Error getting blockhash')
    return
  }

  // Show the blockhash
  res.send({
    ...blockhash,
    ttl: blockhash.cachedAt + 1000 * 30 - Date.now(),
    duration: Date.now() - start + 'ms',
  })
})

app.listen(port, () => {
  console.log(`🐠 Listening on http://localhost:${port}`)
})

// Patch BigInt so we can log it using JSON.stringify without any errors
;(BigInt.prototype as unknown as { toJSON: () => string }).toJSON = function () {
  return this.toString()
}
