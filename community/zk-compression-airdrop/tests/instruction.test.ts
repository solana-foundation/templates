// @vitest-environment node
import { expect, test } from 'vitest'
import {
  AccountRole,
  generateKeyPairSigner,
  createTransactionMessage,
  setTransactionMessageFeePayerSigner,
  appendTransactionMessageInstructions,
  setTransactionMessageLifetimeUsingBlockhash,
  blockhash,
  pipe,
  signTransactionMessageWithSigners,
  getTransactionEncoder,
  getCompiledTransactionMessageDecoder,
} from '@solana/kit'
import { CompressedTokenProgram } from '@lightprotocol/compressed-token'
import { localTestActiveStateTreeInfos } from '@lightprotocol/stateless.js'
import { PublicKey, ComputeBudgetProgram } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import BN from 'bn.js'
import { toKitInstruction } from '../src/lib/light-instruction'

test.each([1, 5])(
  'encodes a real Light mint instruction for %s recipients in a signed V1 transaction',
  async (count) => {
    const signer = await generateKeyPairSigner()
    const owner = new PublicKey(signer.address)
    const mint = new PublicKey('11111111111111111111111111111112')
    const raw = await CompressedTokenProgram.mintTo({
      feePayer: owner,
      mint,
      authority: owner,
      toPubkey: Array.from({ length: count }, () => owner),
      amount: Array.from({ length: count }, () => new BN('9007199254740993')),
      outputStateTreeInfo: localTestActiveStateTreeInfos()[0],
      tokenPoolInfo: {
        mint,
        tokenPoolPda: CompressedTokenProgram.deriveTokenPoolPda(mint),
        tokenProgram: TOKEN_PROGRAM_ID,
        isInitialized: true,
        balance: new BN(0),
        activity: undefined,
        poolIndex: 0,
        bump: CompressedTokenProgram.deriveTokenPoolPdaWithIndex(mint, 0)[1],
      },
    })

    const ix = toKitInstruction(raw, [signer])
    expect(ix.accounts?.find((account) => account.address === signer.address)?.role).toBe(AccountRole.WRITABLE_SIGNER)
    expect(Array.from(ix.data!)).toEqual(Array.from(raw.data))
    expect(
      ix.accounts
        ?.filter((account) => account.address === ix.programAddress)
        .every((account) => account.role === AccountRole.READONLY),
    ).toBe(true)
    const message = pipe(
      createTransactionMessage({ version: 1 }),
      (message) => setTransactionMessageFeePayerSigner(signer, message),
      (message) =>
        setTransactionMessageLifetimeUsingBlockhash(
          {
            blockhash: blockhash('11111111111111111111111111111111'),
            lastValidBlockHeight: 1n,
          },
          message,
        ),
      (message) =>
        appendTransactionMessageInstructions(
          [toKitInstruction(ComputeBudgetProgram.setComputeUnitLimit({ units: 1_000_000 }), [signer]), ix],
          message,
        ),
    )
    const transaction = await signTransactionMessageWithSigners(message)
    expect(getCompiledTransactionMessageDecoder().decode(transaction.messageBytes).version).toBe(1)
    expect(getTransactionEncoder().encode(transaction).length).toBeLessThanOrEqual(1232)
  },
)

test('mint setup instructions include both signers and compile as V1', async () => {
  const payer = await generateKeyPairSigner()
  const mint = await generateKeyPairSigner()
  const raw = await CompressedTokenProgram.createMint({
    feePayer: new PublicKey(payer.address),
    mint: new PublicKey(mint.address),
    authority: new PublicKey('11111111111111111111111111111113'),
    decimals: 9,
    freezeAuthority: null,
    rentExemptBalance: 1_461_600,
  })
  const message = pipe(
    createTransactionMessage({ version: 1 }),
    (tx) => setTransactionMessageFeePayerSigner(payer, tx),
    (tx) =>
      setTransactionMessageLifetimeUsingBlockhash(
        { blockhash: blockhash('11111111111111111111111111111111'), lastValidBlockHeight: 1n },
        tx,
      ),
    (tx) =>
      appendTransactionMessageInstructions(
        raw.map((ix) => toKitInstruction(ix, [payer, mint])),
        tx,
      ),
  )
  const signed = await signTransactionMessageWithSigners(message)
  expect(getCompiledTransactionMessageDecoder().decode(signed.messageBytes).version).toBe(1)
  expect(Object.keys(signed.signatures)).toContain(mint.address)
  expect(getTransactionEncoder().encode(signed).length).toBeLessThanOrEqual(1232)
})
