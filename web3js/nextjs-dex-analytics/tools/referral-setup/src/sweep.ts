import { getAccount, getOrCreateAssociatedTokenAccount, transferChecked } from '@solana/spl-token'
import { Connection, PublicKey } from '@solana/web3.js'
import dotenv from 'dotenv'
import { loadKeypairFromEnv } from './wallet'

dotenv.config()

async function main() {
  const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
  const referralTokenAccountStr = process.env.REFERRAL_TOKEN_ACCOUNT
  const destinationWalletStr = process.env.DESTINATION_WALLET

  if (!referralTokenAccountStr || !destinationWalletStr) {
    throw new Error('Missing env: REFERRAL_TOKEN_ACCOUNT, DESTINATION_WALLET')
  }

  const wallet = loadKeypairFromEnv()
  const connection = new Connection(rpcUrl)

  const referralTokenAccountPubkey = new PublicKey(referralTokenAccountStr)
  const destinationWalletPubkey = new PublicKey(destinationWalletStr)

  const referralTokenAccount = await getAccount(connection, referralTokenAccountPubkey)

  // Ensure the referral token account is owned by our wallet; otherwise we cannot sign to move funds
  if (!referralTokenAccount.owner.equals(wallet.publicKey)) {
    throw new Error(
      `Referral token account owner is ${referralTokenAccount.owner.toBase58()}, which is not your wallet (${wallet.publicKey.toBase58()}). ` +
        'Sweeping requires the account to be owned by your wallet.',
    )
  }

  const mint = referralTokenAccount.mint
  const decimals =
    referralTokenAccount.amount === BigInt(0) ? 0 : (await connection.getTokenSupply(mint)).value.decimals

  if (referralTokenAccount.amount === BigInt(0)) {
    console.log('No balance to sweep.')
    return
  }

  const destinationAta = await getOrCreateAssociatedTokenAccount(connection, wallet, mint, destinationWalletPubkey)

  const amount = referralTokenAccount.amount
  const sig = await transferChecked(
    connection,
    wallet,
    referralTokenAccountPubkey,
    mint,
    destinationAta.address,
    wallet.publicKey,
    amount,
    decimals,
  )

  console.log('Swept', amount.toString(), 'tokens to', destinationAta.address.toBase58())
  console.log('Signature:', `https://solscan.io/tx/${sig}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
