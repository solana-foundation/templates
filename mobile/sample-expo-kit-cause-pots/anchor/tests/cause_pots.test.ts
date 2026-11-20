import {
  appendTransactionMessageInstruction,
  assertIsTransactionWithBlockhashLifetime,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  generateKeyPairSigner,
  getSignatureFromTransaction,
  lamports,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
  type Instruction,
  type KeyPairSigner,
} from '@solana/kit'
import { beforeAll, describe, expect, it } from 'vitest'
import {
  Currency,
  fetchContributor,
  fetchPot,
  findContributorAccountPda,
  findPotPda,
  findVaultPda,
  getAddContributorInstruction,
  getContributeInstructionAsync,
  getCreatePotInstructionAsync,
  getReleaseFundsInstructionAsync,
  getSignReleaseInstruction,
  PotCategory,
} from '../src'
import { createFundedSigner } from './create-funded-signer'

// The `anchor test` command starts a local validator and provides this variable.
const rpcUrl = process.env.ANCHOR_PROVIDER_URL!
const rpc = createSolanaRpc(rpcUrl)
const rpcSubscriptions = createSolanaRpcSubscriptions(rpcUrl.replace('http', 'ws').replace('8899', '8900'))
const sendAndConfirm = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions })

describe('cause_pots', () => {
  let authority: KeyPairSigner
  let friend: KeyPairSigner
  let outsider: KeyPairSigner

  const potName = 'Vacation Fund'

  beforeAll(async () => {
    ;[authority, friend, outsider] = await Promise.all([
      createFundedSigner({ rpc, rpcSubscriptions }),
      createFundedSigner({ rpc, rpcSubscriptions }),
      createFundedSigner({ rpc, rpcSubscriptions }),
    ])
  })

  it('creates a pot with the creator as first contributor', async () => {
    // ARRANGE
    const instruction = await getCreatePotInstructionAsync({
      authority,
      name: potName,
      description: 'Summer trip with friends',
      category: PotCategory.Events,
      currency: Currency.Sol,
      targetAmount: 2_000_000_000n,
      unlockDays: 0n,
      signersRequired: 2,
    })

    // ACT
    await sendInstruction({ instruction, payer: authority })

    // ASSERT
    const [potAddress] = await findPotPda({ authority: authority.address, name: potName })
    const [vaultAddress] = await findVaultPda({ pot: potAddress })
    const pot = await fetchPot(rpc, potAddress)
    expect(pot.data.authority).toEqual(authority.address)
    expect(pot.data.vault).toEqual(vaultAddress)
    expect(pot.data.category).toEqual(PotCategory.Events)
    expect(pot.data.currency).toEqual(Currency.Sol)
    expect(pot.data.targetAmount).toEqual(2_000_000_000n)
    expect(pot.data.signersRequired).toEqual(2)
    expect(pot.data.contributors).toEqual([authority.address])
    expect(pot.data.signatures).toEqual([])
    expect(pot.data.isReleased).toEqual(false)
  })

  it('rejects a signature threshold above the contributor limit', async () => {
    // ARRANGE
    const instruction = await getCreatePotInstructionAsync({
      authority,
      name: 'Unreleasable Pot',
      description: 'Threshold nobody could ever meet',
      category: PotCategory.Goal,
      currency: Currency.Sol,
      targetAmount: 1_000_000_000n,
      unlockDays: 0n,
      signersRequired: 21,
    })

    // ACT + ASSERT
    await expectAnchorError(sendInstruction({ instruction, payer: authority }), 6004) // InvalidSignersRequired
  })

  it('rejects an unlock time that would overflow the clock', async () => {
    // ARRANGE
    const instruction = await getCreatePotInstructionAsync({
      authority,
      name: 'Overflow Pot',
      description: 'Unlocks after the heat death of the universe',
      category: PotCategory.Goal,
      currency: Currency.Sol,
      targetAmount: 1_000_000_000n,
      unlockDays: 200_000_000_000_000n,
      signersRequired: 1,
    })

    // ACT + ASSERT
    await expectAnchorError(sendInstruction({ instruction, payer: authority }), 6012) // Overflow
  })

  it('adds a contributor', async () => {
    // ARRANGE
    const [potAddress] = await findPotPda({ authority: authority.address, name: potName })
    const instruction = getAddContributorInstruction({
      pot: potAddress,
      authority,
      newContributor: friend.address,
    })

    // ACT
    await sendInstruction({ instruction, payer: authority })

    // ASSERT
    const pot = await fetchPot(rpc, potAddress)
    expect(pot.data.contributors).toEqual([authority.address, friend.address])
  })

  it('accepts contributions and tracks them per contributor', async () => {
    // ARRANGE
    const [potAddress] = await findPotPda({ authority: authority.address, name: potName })
    const [vaultAddress] = await findVaultPda({ pot: potAddress })

    // ACT
    await sendInstruction({
      instruction: await getContributeInstructionAsync({
        pot: potAddress,
        contributor: authority,
        amount: 750_000_000n,
      }),
      payer: authority,
    })
    await sendInstruction({
      instruction: await getContributeInstructionAsync({ pot: potAddress, contributor: friend, amount: 250_000_000n }),
      payer: friend,
    })

    // ASSERT
    const pot = await fetchPot(rpc, potAddress)
    expect(pot.data.totalContributed).toEqual(1_000_000_000n)
    const { value: vaultBalance } = await rpc.getBalance(vaultAddress).send()
    expect(vaultBalance).toEqual(lamports(1_000_000_000n))
    const [contributorAddress] = await findContributorAccountPda({ pot: potAddress, contributor: friend.address })
    const contributor = await fetchContributor(rpc, contributorAddress)
    expect(contributor.data.totalContributed).toEqual(250_000_000n)
    expect(contributor.data.contributionCount).toEqual(1)
  })

  it('rejects a release signature from a non-contributor', async () => {
    // ARRANGE
    const [potAddress] = await findPotPda({ authority: authority.address, name: potName })
    const instruction = getSignReleaseInstruction({ pot: potAddress, signer: outsider })

    // ACT + ASSERT
    await expectAnchorError(sendInstruction({ instruction, payer: outsider }), 6011) // NotAContributor
  })

  it('rejects signing the same release twice', async () => {
    // ARRANGE
    const [potAddress] = await findPotPda({ authority: authority.address, name: potName })
    await sendInstruction({
      instruction: getSignReleaseInstruction({ pot: potAddress, signer: authority }),
      payer: authority,
    })

    // ACT + ASSERT
    await expectAnchorError(
      sendInstruction({
        instruction: getSignReleaseInstruction({ pot: potAddress, signer: authority }),
        payer: authority,
      }),
      6001, // AlreadySigned
    )
  })

  it('rejects a release below the signature threshold', async () => {
    // ARRANGE: one signature is in, the pot requires two.
    const [potAddress] = await findPotPda({ authority: authority.address, name: potName })
    const instruction = await getReleaseFundsInstructionAsync({
      pot: potAddress,
      authority,
      recipient: authority.address,
    })

    // ACT + ASSERT
    await expectAnchorError(sendInstruction({ instruction, payer: authority }), 6008) // InsufficientSignatures
  })

  it('rejects the pot as recipient', async () => {
    // ARRANGE
    const [potAddress] = await findPotPda({ authority: authority.address, name: potName })
    const instruction = await getReleaseFundsInstructionAsync({ pot: potAddress, authority, recipient: potAddress })

    // ACT + ASSERT
    await expectAnchorError(sendInstruction({ instruction, payer: authority }), 6014) // RecipientIsPot
  })

  it('releases the vault to the recipient once the threshold is met', async () => {
    // ARRANGE
    const [potAddress] = await findPotPda({ authority: authority.address, name: potName })
    const [vaultAddress] = await findVaultPda({ pot: potAddress })
    const recipient = await generateKeyPairSigner()
    await sendInstruction({
      instruction: getSignReleaseInstruction({ pot: potAddress, signer: friend }),
      payer: friend,
    })

    // ACT
    await sendInstruction({
      instruction: await getReleaseFundsInstructionAsync({ pot: potAddress, authority, recipient: recipient.address }),
      payer: authority,
    })

    // ASSERT
    const pot = await fetchPot(rpc, potAddress)
    expect(pot.data.isReleased).toEqual(true)
    expect(pot.data.recipient).toEqual({ __option: 'Some', value: recipient.address })
    const { value: vaultBalance } = await rpc.getBalance(vaultAddress).send()
    expect(vaultBalance).toEqual(lamports(0n))
    const { value: recipientBalance } = await rpc.getBalance(recipient.address).send()
    expect(recipientBalance).toEqual(lamports(1_000_000_000n))
  })

  it('rejects a release before the unlock time', async () => {
    // ARRANGE: a fresh pot that unlocks in a day.
    const name = 'Locked Pot'
    await sendInstruction({
      instruction: await getCreatePotInstructionAsync({
        authority,
        name,
        description: 'Unlocks tomorrow',
        category: PotCategory.Goal,
        currency: Currency.Sol,
        targetAmount: 1_000_000_000n,
        unlockDays: 1n,
        signersRequired: 1,
      }),
      payer: authority,
    })
    const [potAddress] = await findPotPda({ authority: authority.address, name })
    await sendInstruction({
      instruction: await getContributeInstructionAsync({
        pot: potAddress,
        contributor: authority,
        amount: 100_000_000n,
      }),
      payer: authority,
    })

    // ACT + ASSERT: the time-lock blocks both signing and releasing.
    await expectAnchorError(
      sendInstruction({
        instruction: getSignReleaseInstruction({ pot: potAddress, signer: authority }),
        payer: authority,
      }),
      6015, // TimeLockNotExpired
    )
    await expectAnchorError(
      sendInstruction({
        instruction: await getReleaseFundsInstructionAsync({
          pot: potAddress,
          authority,
          recipient: authority.address,
        }),
        payer: authority,
      }),
      6015, // TimeLockNotExpired
    )
  })
})

// The custom program error code surfaces on the cause of the send error, as
// `Custom program error: #<code>`.
async function expectAnchorError(promise: Promise<unknown>, code: number) {
  const error = await promise.then(
    () => {
      throw new Error('Expected the transaction to fail, but it succeeded')
    },
    (error: unknown) => error as Error & { cause?: Error },
  )
  expect(String(error.cause?.message ?? error.message)).toContain(`#${code}`)
}

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
