import 'dotenv/config'
import express from 'express'
import type { Request, Response } from 'express'
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { createDynamicWalletClient } from '@dynamic-labs-wallet/node'
import { solana } from '@dynamic-labs-wallet/node-svm'

const {
  DYNAMIC_ENVIRONMENT_ID,
  DYNAMIC_API_TOKEN,
  SOLANA_RPC_URL = 'https://api.devnet.solana.com',
  PORT = '3000',
} = process.env

if (!DYNAMIC_ENVIRONMENT_ID || !DYNAMIC_API_TOKEN) {
  console.error(
    'Missing required env. Copy .env.example to .env and set DYNAMIC_ENVIRONMENT_ID and DYNAMIC_API_TOKEN.\n' +
      'Get them from https://app.dynamic.xyz/dashboard/developer',
  )
  process.exit(1)
}

const client = createDynamicWalletClient({
  environmentId: DYNAMIC_ENVIRONMENT_ID,
  apiToken: DYNAMIC_API_TOKEN,
  extensions: [solana()],
})

const connection = new Connection(SOLANA_RPC_URL, 'confirmed')

const app = express()
app.use(express.json())

app.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true, rpc: SOLANA_RPC_URL })
})

app.post('/wallets', async (_req: Request, res: Response) => {
  try {
    const wallet = await client.solana.createWallet()
    res.json({ address: wallet.address })
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' })
  }
})

app.get('/wallets/:address/balance', async (req: Request, res: Response) => {
  try {
    const lamports = await connection.getBalance(new PublicKey(req.params.address))
    res.json({ lamports, sol: lamports / LAMPORTS_PER_SOL })
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'Unknown error' })
  }
})

app.post('/transfer', async (req: Request, res: Response) => {
  try {
    const { from, to, sol } = req.body as { from?: string; to?: string; sol?: number }
    if (!from || !to || !sol) {
      return res.status(400).json({ error: 'Body must include { from, to, sol }' })
    }

    const fromPubkey = new PublicKey(from)
    const toPubkey = new PublicKey(to)
    const { blockhash } = await connection.getLatestBlockhash()

    const tx = new Transaction()
    tx.recentBlockhash = blockhash
    tx.feePayer = fromPubkey
    tx.add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: Math.round(sol * LAMPORTS_PER_SOL),
      }),
    )

    const signed = await client.solana.signTransaction({ address: from, transaction: tx })
    const signature = await connection.sendRawTransaction(signed.serialize())
    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight: (await connection.getLatestBlockhash()).lastValidBlockHeight,
    })

    res.json({ signature })
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' })
  }
})

const port = Number(PORT)
app.listen(port, () => {
  console.log(`Dynamic + Solana server listening on http://localhost:${port}`)
  console.log(`RPC: ${SOLANA_RPC_URL}`)
})
