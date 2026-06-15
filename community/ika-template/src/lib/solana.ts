import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
  type MessageV0,
} from '@solana/web3.js'

/**
 * Solana helpers.
 *
 * The whole point of this template: an Ika ED25519 dWallet's 32-byte public key
 * IS a Solana address. We airdrop devnet SOL to it, build a real transfer where
 * the dWallet is the sole signer + fee payer, get Ika to produce the 64-byte
 * EdDSA signature, splice it in, and broadcast. No bridge, no wrapped anything.
 * The dWallet simply *is* a Solana account.
 */

export const SOLANA_RPC_URL = import.meta.env.VITE_SOLANA_RPC_URL ?? 'https://api.devnet.solana.com'

export const connection = new Connection(SOLANA_RPC_URL, 'confirmed')

/** Convert a 32-byte ed25519 public key into a Solana address (base58). */
export function pubkeyBytesToSolanaAddress(pubkey: Uint8Array): string {
  return new PublicKey(pubkey).toBase58()
}

export function lamportsToSol(lamports: number): number {
  return lamports / LAMPORTS_PER_SOL
}

export function solToLamports(sol: number): number {
  return Math.round(sol * LAMPORTS_PER_SOL)
}

export async function getBalanceLamports(address: string): Promise<number> {
  return connection.getBalance(new PublicKey(address))
}

/** Request a devnet airdrop and wait for confirmation. Returns the tx signature. */
export async function airdropDevnetSol(address: string, sol = 1): Promise<string> {
  const signature = await connection.requestAirdrop(new PublicKey(address), solToLamports(sol))
  const latest = await connection.getLatestBlockhash()
  await connection.confirmTransaction({ signature, ...latest }, 'confirmed')
  return signature
}

/**
 * Build a SystemProgram transfer FROM the dWallet TO `toAddress`.
 * The dWallet is both the fee payer and the only signer, so the only signature
 * the transaction needs is the EdDSA signature Ika will produce.
 *
 * Returns the unsigned VersionedTransaction plus the exact message bytes that
 * must be signed by the dWallet (Ika signs `message.serialize()`).
 */
export async function buildDWalletTransfer(params: {
  fromDWalletAddress: string
  toAddress: string
  lamports: number
}): Promise<{ transaction: VersionedTransaction; message: MessageV0; messageBytes: Uint8Array }> {
  const from = new PublicKey(params.fromDWalletAddress)
  const to = new PublicKey(params.toAddress)

  const { blockhash } = await connection.getLatestBlockhash()

  const message = new TransactionMessage({
    payerKey: from,
    recentBlockhash: blockhash,
    instructions: [
      SystemProgram.transfer({
        fromPubkey: from,
        toPubkey: to,
        lamports: params.lamports,
      }),
    ],
  }).compileToV0Message()

  const transaction = new VersionedTransaction(message)

  return { transaction, message, messageBytes: message.serialize() }
}

/**
 * Splice a 64-byte ed25519 signature (produced by the dWallet via Ika) into a
 * VersionedTransaction and broadcast it to devnet.
 *
 * `addSignature` validates that the signature verifies against the signer's
 * public key, so a bad splice fails loudly here rather than on-chain.
 */
export async function broadcastWithDWalletSignature(params: {
  transaction: VersionedTransaction
  dWalletAddress: string
  signature: Uint8Array
}): Promise<string> {
  const { transaction, dWalletAddress, signature } = params

  transaction.addSignature(new PublicKey(dWalletAddress), signature)

  const txSignature = await connection.sendRawTransaction(transaction.serialize(), {
    skipPreflight: false,
  })

  const latest = await connection.getLatestBlockhash()
  await connection.confirmTransaction({ signature: txSignature, ...latest }, 'confirmed')

  return txSignature
}

export function explorerTxUrl(signature: string): string {
  return `https://explorer.solana.com/tx/${signature}?cluster=devnet`
}

export function explorerAddressUrl(address: string): string {
  return `https://explorer.solana.com/address/${address}?cluster=devnet`
}
