import { getAddMemoInstruction } from '@solana-program/memo'
import {
  address,
  appendTransactionMessageInstruction,
  compileTransaction,
  createTransactionMessage,
  getBase58Decoder,
  getTransactionEncoder,
  pipe,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
} from '@solana/kit'
import {
  SolanaSignAndSendTransaction,
  SolanaSignMessage,
  type SolanaSignAndSendTransactionFeature,
  type SolanaSignMessageFeature,
} from '@solana/wallet-standard-features'
import type { IdentifierString, WalletAccount } from '@wallet-standard/base'

import { CHAIN } from './cluster'
import { client } from './rpc'
import { getWalletFeature, type SolanaWallet } from './wallet-store'

/** The active connection, as {@link WalletState.connected} holds it. */
type Connection = { account: WalletAccount; wallet: SolanaWallet }

function requireFeature<TFeature>(wallet: SolanaWallet, name: IdentifierString): TFeature {
  const feature = getWalletFeature<TFeature>(wallet, name)
  if (!feature) {
    throw new Error(`${wallet.name} does not implement ${name}.`)
  }
  return feature
}

/**
 * Signs arbitrary bytes with the connected account. Nothing reaches the network and no fee is paid.
 *
 * The account handed to the wallet is the very object the wallet published, straight out of
 * `wallet.accounts`. Wallets validate `input.account` against their own objects and reject anything
 * else, which is the trap a wrapper type would walk into here.
 */
export async function signMessage({ account, wallet }: Connection, message: string): Promise<string> {
  const feature = requireFeature<SolanaSignMessageFeature[typeof SolanaSignMessage]>(wallet, SolanaSignMessage)

  const [output] = await feature.signMessage({
    account,
    message: new TextEncoder().encode(message),
  })
  // The wallet controls how many outputs come back for one input, so an empty array is possible.
  // Naming it here beats letting destructuring report `Cannot destructure property 'signature'`.
  if (!output) {
    throw new Error(`${wallet.name} returned no signature.`)
  }

  return getBase58Decoder().decode(output.signature)
}

/**
 * The end-to-end path, and the one to copy when building something real.
 *
 * Kit does everything up to the wire format — the instruction from a program client, the fee payer,
 * the blockhash lifetime, the compile — and `solana:signAndSendTransaction` takes it from there.
 * Nothing in between needs a signer abstraction, because the feature takes bytes.
 *
 * Swap `getAddMemoInstruction(...)` for any other program client's instruction and the rest is
 * unchanged.
 */
export async function sendMemo({ account, wallet }: Connection, memo: string): Promise<string> {
  const feature = requireFeature<SolanaSignAndSendTransactionFeature[typeof SolanaSignAndSendTransaction]>(
    wallet,
    SolanaSignAndSendTransaction,
  )

  const { value: latestBlockhash } = await client.rpc.getLatestBlockhash({ commitment: 'confirmed' }).send()

  const transaction = pipe(
    createTransactionMessage({ version: 0 }),
    (message) => setTransactionMessageFeePayer(address(account.address), message),
    (message) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, message),
    (message) => appendTransactionMessageInstruction(getAddMemoInstruction({ memo }), message),
    compileTransaction,
  )

  const [output] = await feature.signAndSendTransaction({
    account,
    chain: CHAIN,
    // The wire format: the compiled message plus its signature slots, which the wallet fills in.
    transaction: new Uint8Array(getTransactionEncoder().encode(transaction)),
  })
  if (!output) {
    throw new Error(`${wallet.name} returned no signature.`)
  }

  return getBase58Decoder().decode(output.signature)
}
