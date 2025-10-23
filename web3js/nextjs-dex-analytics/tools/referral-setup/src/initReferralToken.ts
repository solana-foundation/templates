import { ReferralProvider } from '@jup-ag/referral-sdk'
import { Connection, PublicKey, sendAndConfirmTransaction } from '@solana/web3.js'
import dotenv from 'dotenv'
import { loadKeypairFromEnv } from './wallet'

dotenv.config()

async function main() {
  const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
  const referralAccount = process.env.ULTRA_REFERRAL_ACCOUNT
  const feeMint = process.env.FEE_MINT
  if (!referralAccount || !feeMint) {
    throw new Error('Missing env: ULTRA_REFERRAL_ACCOUNT, FEE_MINT')
  }
  const wallet = loadKeypairFromEnv()
  const connection = new Connection(rpcUrl)
  const provider = new ReferralProvider(connection)

  const mint = new PublicKey(feeMint)
  const referralAccountPubKey = new PublicKey(referralAccount)

  console.log('Using wallet:', wallet.publicKey.toBase58())
  console.log('Referral account:', referralAccount)
  console.log('Mint:', mint.toBase58())

  const txData = await provider.initializeReferralTokenAccountV2({
    payerPubKey: wallet.publicKey,
    referralAccountPubKey: referralAccountPubKey,
    mint,
  })

  const existing = await connection.getAccountInfo(txData.tokenAccount)
  if (existing) {
    console.log(`Referral token account already exists: ${txData.tokenAccount.toBase58()} for mint ${mint.toBase58()}`)
    return
  }

  const sig = await sendAndConfirmTransaction(connection, txData.tx, [wallet])
  console.log('Created referral token account:', txData.tokenAccount.toBase58())
  console.log('Signature:', `https://solscan.io/tx/${sig}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
