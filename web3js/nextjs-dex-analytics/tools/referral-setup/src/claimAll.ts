import { ReferralProvider } from '@jup-ag/referral-sdk'
import { Connection, PublicKey, sendAndConfirmRawTransaction } from '@solana/web3.js'
import dotenv from 'dotenv'
import { loadKeypairFromEnv } from './wallet'

dotenv.config()

async function main() {
  const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
  const referralAccount = process.env.ULTRA_REFERRAL_ACCOUNT
  if (!referralAccount) {
    throw new Error('Missing env: ULTRA_REFERRAL_ACCOUNT')
  }
  const wallet = loadKeypairFromEnv()
  const connection = new Connection(rpcUrl)
  const provider = new ReferralProvider(connection)

  const referralAccountPubKey = new PublicKey(referralAccount)

  console.log('Using wallet:', wallet.publicKey.toBase58())
  console.log('Referral account:', referralAccount)

  const txs = await provider.claimAllV2({
    payerPubKey: wallet.publicKey,
    referralAccountPubKey,
  })

  for (const tx of txs) {
    tx.sign([wallet])
    const sig = await sendAndConfirmRawTransaction(connection, tx.serialize())
    console.log('Claimed fees. Signature:', `https://solscan.io/tx/${sig}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
