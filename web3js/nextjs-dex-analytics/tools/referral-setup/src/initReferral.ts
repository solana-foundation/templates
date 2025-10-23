import { ReferralProvider } from '@jup-ag/referral-sdk'
import { Connection, PublicKey, sendAndConfirmTransaction } from '@solana/web3.js'
import dotenv from 'dotenv'
import { loadKeypairFromEnv } from './wallet'

dotenv.config()

async function main() {
  const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
  const wallet = loadKeypairFromEnv()

  const connection = new Connection(rpcUrl)
  const provider = new ReferralProvider(connection)
  const projectPubKey = new PublicKey('DkiqsTrw1u1bYFumumC7sCG2S8K25qc2vemJFHyW2wJc')

  console.log('Using wallet:', wallet.publicKey.toBase58())

  const txData = await provider.initializeReferralAccountWithName({
    payerPubKey: wallet.publicKey,
    partnerPubKey: wallet.publicKey,
    projectPubKey,
    name: process.env.REFERRAL_NAME || 'solana-dex-analytics-template',
  })

  const existing = await connection.getAccountInfo(txData.referralAccountPubKey)
  if (existing) {
    console.log(`Referral account already exists: ${txData.referralAccountPubKey.toBase58()}`)
    return
  }

  const sig = await sendAndConfirmTransaction(connection, txData.tx, [wallet])
  console.log('Created referral account:', txData.referralAccountPubKey.toBase58())
  console.log('Signature:', `https://solscan.io/tx/${sig}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
