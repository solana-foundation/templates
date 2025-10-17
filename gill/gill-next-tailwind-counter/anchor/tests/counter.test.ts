import {
  Blockhash,
  createSolanaClient,
  createTransaction,
  generateKeyPairSigner,
  Instruction,
  isSolanaError,
  KeyPairSigner,
  signTransactionMessageWithSigners,
} from 'gill'
import {
  fetchCounter,
  getCloseInstruction,
  getDecrementInstruction,
  getIncrementInstruction,
  getInitializeInstruction,
  getSetInstruction,
} from '../src'
// @ts-ignore error TS2307 suggest setting `moduleResolution` but this is already configured
import { loadKeypairSignerFromFile } from 'gill/node'

const { rpc, sendAndConfirmTransaction } = createSolanaClient({ urlOrMoniker: process.env.ANCHOR_PROVIDER_URL! })

describe('counter', () => {
  let payer: KeyPairSigner
  let counter: KeyPairSigner

  beforeAll(async () => {
    counter = await generateKeyPairSigner()
    payer = await loadKeypairSignerFromFile(process.env.ANCHOR_WALLET!)
  })

  it('Initialize Counter', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getInitializeInstruction({ payer: payer, counter: counter })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSER
    const currentCounter = await fetchCounter(rpc, counter.address)
    expect(currentCounter.data.count).toEqual(0)
  })

  it('Increment Counter', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getIncrementInstruction({
      counter: counter.address,
    })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchCounter(rpc, counter.address)
    expect(currentCount.data.count).toEqual(1)
  })

  it('Increment Counter Again', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getIncrementInstruction({ counter: counter.address })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchCounter(rpc, counter.address)
    expect(currentCount.data.count).toEqual(2)
  })

  it('Decrement Counter', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getDecrementInstruction({
      counter: counter.address,
    })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchCounter(rpc, counter.address)
    expect(currentCount.data.count).toEqual(1)
  })

  it('Set counter value', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getSetInstruction({ counter: counter.address, value: 42 })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchCounter(rpc, counter.address)
    expect(currentCount.data.count).toEqual(42)
  })

  it('Set close the counter account', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getCloseInstruction({
      payer: payer,
      counter: counter.address,
    })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    try {
      await fetchCounter(rpc, counter.address)
    } catch (e) {
      if (!isSolanaError(e)) {
        throw new Error(`Unexpected error: ${e}`)
      }
      expect(e.message).toEqual(`Account not found at address: ${counter.address}`)
    }
  })
})

// Helper function to keep the tests DRY
let latestBlockhash: Awaited<ReturnType<typeof getLatestBlockhash>> | undefined
async function getLatestBlockhash(): Promise<Readonly<{ blockhash: Blockhash; lastValidBlockHeight: bigint }>> {
  if (latestBlockhash) {
    return latestBlockhash
  }
  return await rpc
    .getLatestBlockhash()
    .send()
    .then(({ value }) => value)
}
async function sendAndConfirm({ ix, payer }: { ix: Instruction; payer: KeyPairSigner }) {
  const tx = createTransaction({
    feePayer: payer,
    instructions: [ix],
    version: 'legacy',
    latestBlockhash: await getLatestBlockhash(),
  })
  const signedTransaction = await signTransactionMessageWithSigners(tx)
  return await sendAndConfirmTransaction(signedTransaction)
}
