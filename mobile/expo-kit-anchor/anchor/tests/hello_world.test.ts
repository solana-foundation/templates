import {
  appendTransactionMessageInstruction,
  assertIsTransactionWithBlockhashLifetime,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  getSignatureFromTransaction,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
  type Instruction,
  type KeyPairSigner,
} from '@solana/kit'
import { beforeAll, describe, expect, it } from 'vitest'
import { fetchCounter, findCounterPda, getIncrementInstructionAsync, getInitializeInstructionAsync } from '../src'
import { createFundedSigner } from './create-funded-signer'

// The `anchor test` command starts a local validator and provides this variable.
const rpcUrl = process.env.ANCHOR_PROVIDER_URL!
const rpc = createSolanaRpc(rpcUrl)
const rpcSubscriptions = createSolanaRpcSubscriptions(rpcUrl.replace('http', 'ws').replace('8899', '8900'))
const sendAndConfirm = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions })

describe('hello_world', () => {
  let payer: KeyPairSigner

  beforeAll(async () => {
    payer = await createFundedSigner({ rpc, rpcSubscriptions })
  })

  it('initializes the counter', async () => {
    // ARRANGE
    const instruction = await getInitializeInstructionAsync({ payer })

    // ACT
    const signature = await sendInstruction({ instruction, payer })
    console.log('Initialize transaction signature', signature)

    // ASSERT
    const [counterAddress] = await findCounterPda({ authority: payer.address })
    const counter = await fetchCounter(rpc, counterAddress)
    expect(counter.data.count).toEqual(0n)
  })

  it('increments the counter', async () => {
    // ARRANGE
    const instruction = await getIncrementInstructionAsync({ authority: payer })

    // ACT
    const signature = await sendInstruction({ instruction, payer })
    console.log('Increment transaction signature', signature)

    // ASSERT
    const [counterAddress] = await findCounterPda({ authority: payer.address })
    const counter = await fetchCounter(rpc, counterAddress)
    expect(counter.data.count).toEqual(1n)
  })
})

// Helper function to keep the tests DRY
async function sendInstruction({ instruction, payer }: { instruction: Instruction; payer: KeyPairSigner }) {
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send()
  const transaction = await pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => setTransactionMessageFeePayerSigner(payer, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    (tx) => appendTransactionMessageInstruction(instruction, tx),
    (tx) => signTransactionMessageWithSigners(tx),
  )
  assertIsTransactionWithBlockhashLifetime(transaction)
  await sendAndConfirm(transaction, { commitment: 'confirmed' })
  return getSignatureFromTransaction(transaction)
}
