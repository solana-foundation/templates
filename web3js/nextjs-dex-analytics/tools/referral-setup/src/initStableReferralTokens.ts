import { ReferralProvider } from '@jup-ag/referral-sdk'
import { Connection, Keypair, PublicKey, sendAndConfirmTransaction } from '@solana/web3.js'
import dotenv from 'dotenv'
import { loadKeypairFromEnv } from './wallet'

dotenv.config()

async function ensureReferralTokenAccount(
  provider: ReferralProvider,
  connection: Connection,
  payerPubKey: PublicKey,
  referralAccountPubKey: PublicKey,
  mint: PublicKey,
  signer: Keypair,
) {
  // Ensure enough SOL balance for ATA rent + fees
  const lamports = await connection.getBalance(payerPubKey)
  const minRent = await connection.getMinimumBalanceForRentExemption(165) // SPL token account size
  const buffer = 500_000 // safety buffer for fees
  const needed = minRent + buffer
  if (lamports < needed) {
    const fmt = (n: number) => (n / 1_000_000_000).toFixed(6)
    console.error(
      `Insufficient SOL to create ATA for ${mint.toBase58()}. Have ${fmt(lamports)} SOL, need at least ${fmt(needed)} SOL. ` +
        `Please top up your payer wallet (${payerPubKey.toBase58()}) and rerun.`,
    )
    return
  }

  const txData = await provider.initializeReferralTokenAccountV2({
    payerPubKey,
    referralAccountPubKey,
    mint,
  })

  const existing = await connection.getAccountInfo(txData.tokenAccount)
  if (existing) {
    console.log(`Referral token account already exists: ${txData.tokenAccount.toBase58()} for mint ${mint.toBase58()}`)
    return
  }

  const sig = await sendAndConfirmTransaction(connection, txData.tx, [signer])
  console.log('Created referral token account:', txData.tokenAccount.toBase58(), 'for mint', mint.toBase58())
  console.log('Signature:', `https://solscan.io/tx/${sig}`)
}

async function main() {
  const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
  const referralAccount = process.env.ULTRA_REFERRAL_ACCOUNT
  if (!referralAccount) {
    throw new Error('Missing env: ULTRA_REFERRAL_ACCOUNT')
  }

  // Mainnet stablecoin mints
  const USDC = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
  const USDT = new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB')

  const wallet = loadKeypairFromEnv()
  const connection = new Connection(rpcUrl)
  const provider = new ReferralProvider(connection)

  const referralAccountPubKey = new PublicKey(referralAccount)

  console.log('Using wallet:', wallet.publicKey.toBase58())
  console.log('Referral account:', referralAccount)

  await ensureReferralTokenAccount(provider, connection, wallet.publicKey, referralAccountPubKey, USDC, wallet)
  await ensureReferralTokenAccount(provider, connection, wallet.publicKey, referralAccountPubKey, USDT, wallet)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
