import { config as loadEnv } from 'dotenv'
import { Keypair } from '@solana/web3.js'
import { createRpc } from '@lightprotocol/stateless.js'
import { CompressedTokenProgram } from '@lightprotocol/compressed-token'
import { MINT_SIZE } from '@solana/spl-token'
import { PublicKey } from '@solana/web3.js'
import { createClient, createKeyPairSignerFromBytes } from '@solana/kit'
import { solanaRpc } from '@solana/kit-plugin-rpc'
import { toKitInstruction } from '../src/lib/light-instruction'
import bs58 from 'bs58'
import fs from 'fs'
import path from 'path'
import { writeJsonAtomically } from './write-json-atomically'

loadEnv({ path: '.env.local' })
loadEnv()

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
  if ((await rpc.getGenesisHash()) !== 'EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG')
    throw new Error('The setup script requires devnet')

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
  console.log('Setup payer:', payerKeypair.publicKey.toBase58())
  console.log('Network:', new URL(RPC_ENDPOINT).hostname)

  const balance = await rpc.getBalance(payerKeypair.publicKey)
  console.log('Balance:', (balance / 1e9).toFixed(4), 'SOL\n')

  const payer = await createKeyPairSignerFromBytes(payerKeypair.secretKey)
  const mintKeypair = Keypair.generate()
  console.log('Candidate mint:', mintKeypair.publicKey.toBase58())
  const mintSigner = await createKeyPairSignerFromBytes(mintKeypair.secretKey)
  const authority = new PublicKey(process.env.MINT_AUTHORITY || payerKeypair.publicKey.toBase58())
  console.log('Mint authority:', authority.toBase58())
  const websocket = new URL(RPC_ENDPOINT)
  websocket.protocol = websocket.protocol === 'https:' ? 'wss:' : 'ws:'
  const client = createClient()
    .use(() => ({ payer }))
    .use(solanaRpc({ rpcUrl: RPC_ENDPOINT, rpcSubscriptionsUrl: websocket.href, transactionConfig: { version: 1 } }))
  const instructions = await CompressedTokenProgram.createMint({
    feePayer: payerKeypair.publicKey,
    mint: mintKeypair.publicKey,
    decimals: 9,
    authority,
    freezeAuthority: null,
    rentExemptBalance: await rpc.getMinimumBalanceForRentExemption(MINT_SIZE),
  })
  const result = await client.sendTransaction(instructions.map((ix) => toKitInstruction(ix, [payer, mintSigner])))
  const mint = mintKeypair.publicKey
  const transactionSignature = result.context.signature

  console.log('Mint created!')
  console.log('Mint Address:', mint.toBase58())
  console.log('Transaction:', transactionSignature)

  const config = {
    mintAddress: mint.toBase58(),
    authority: authority.toBase58(),
    decimals: 9,
    name: 'My Airdrop Token',
    symbol: 'AIRDROP',
    network: RPC_ENDPOINT,
    createdAt: new Date().toISOString(),
  }

  writeJsonAtomically(path.join(__dirname, 'compressed-mint-config.json'), config)

  console.log('\nConfig saved to scripts/compressed-mint-config.json')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
