import {
  Blockhash,
  createSolanaClient,
  createTransaction,
  Instruction,
  KeyPairSigner,
  signTransactionMessageWithSigners,
} from 'gill'
import { getGreetInstruction } from '../src'
// @ts-ignore error TS2307 suggest setting `moduleResolution` but this is already configured
import { loadKeypairSignerFromFile } from 'gill/node'

const { rpc, sendAndConfirmTransaction } = createSolanaClient({ urlOrMoniker: process.env.ANCHOR_PROVIDER_URL! })
describe('basic', () => {
  let payer: KeyPairSigner

  beforeAll(async () => {
    payer = await loadKeypairSignerFromFile(process.env.ANCHOR_WALLET!)
  })

  it('should run the program and print "GM!" to the transaction log', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getGreetInstruction()

    // ACT
    const sx = await sendAndConfirm({ ix, payer })

    // ASSERT
    expect(sx).toBeDefined()
    console.log('Transaction signature:', sx)
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
