import 'dotenv/config'
import { Keypair } from '@solana/web3.js'
import { createRpc } from '@lightprotocol/stateless.js'
import { createMint } from '@lightprotocol/compressed-token'
import bs58 from 'bs58'
import fs from 'fs'
import path from 'path'

async function main() {
  const RPC_ENDPOINT = process.env.RPC_ENDPOINT
  if (!RPC_ENDPOINT) {
    console.error('\nRPC_ENDPOINT environment variable not set')
    console.log('Get a free API key from: https://dev.helius.xyz/')
    console.log('Then set: RPC_ENDPOINT=https://devnet.helius-rpc.com?api-key=YOUR_KEY\n')
    process.exit(1)
  }

  // createRpc accepts 3 endpoints: (1) standard Solana RPC, (2) compression API (Photon indexer), (3) prover
  // Helius provides all three services on the same endpoint, so we pass it three times
  // See: https://www.zkcompression.com/learn/node-operators
  const rpc = createRpc(RPC_ENDPOINT, RPC_ENDPOINT, RPC_ENDPOINT)

  const devWallet = process.env.DEV_WALLET || path.join(__dirname, '..', 'dev-wallet.json')

  let walletData
  if (fs.existsSync(devWallet)) {
    walletData = JSON.parse(fs.readFileSync(devWallet, 'utf-8'))
  } else {
    walletData = devWallet
  }

  const secretKey = Array.isArray(walletData)
    ? typeof walletData[0] === 'string'
      ? bs58.decode(walletData[0])
      : new Uint8Array(walletData)
    : typeof walletData === 'string'
      ? bs58.decode(walletData)
      : new Uint8Array(walletData)

  const payerKeypair = Keypair.fromSecretKey(secretKey)

  console.log('Creating compressed token mint...')
  console.log('Authority:', payerKeypair.publicKey.toBase58())
  console.log('Network:', RPC_ENDPOINT)

  const balance = await rpc.getBalance(payerKeypair.publicKey)
  console.log('Balance:', (balance / 1e9).toFixed(4), 'SOL\n')

  const { mint, transactionSignature } = await createMint(rpc, payerKeypair, payerKeypair.publicKey, 9)

  console.log('Mint created!')
  console.log('Mint Address:', mint.toBase58())
  console.log('Transaction:', transactionSignature)

  const config = {
    mintAddress: mint.toBase58(),
    authority: payerKeypair.publicKey.toBase58(),
    decimals: 9,
    name: 'My Airdrop Token',
    symbol: 'AIRDROP',
    network: RPC_ENDPOINT,
    createdAt: new Date().toISOString(),
  }

  fs.writeFileSync(path.join(__dirname, 'compressed-mint-config.json'), JSON.stringify(config, null, 2))

  console.log('\nConfig saved to scripts/compressed-mint-config.json')
}

main().catch(console.error)
