/// <reference types="vitest/globals" />

import {
  createSolanaClient,
  createKeyPairSignerFromBytes,
  generateKeyPairSigner,
  address,
  lamports,
  getProgramDerivedAddress,
  createTransaction,
  type Address,
  type TransactionSigner,
} from 'gill'
import * as fs from 'fs'
import { getInitializeAirdropInstruction } from '../generated/clients/ts/instructions/initializeAirdrop'
import { getClaimAirdropInstruction } from '../generated/clients/ts/instructions/claimAirdrop'
import { fetchAirdropState } from '../generated/clients/ts/accounts/airdropState'
import { fetchClaimStatus } from '../generated/clients/ts/accounts/claimStatus'
import { SOLANA_DISTRIBUTOR_PROGRAM_ADDRESS } from '../generated/clients/ts/programs'
import { generateGillMerkleTree, generateGillProof, type GillMerkleTree } from '../lib/merkle-tree-manager'
import type { GillRecipient } from '../lib/types'

describe('Solana Distributor (Comprehensive Gill + Codama)', () => {
  const NETWORK = 'devnet'
  let client: ReturnType<typeof createSolanaClient>
  let rpc: any
  let sendAndConfirmTransaction: any

  let authority: TransactionSigner
  let recipient1: TransactionSigner
  let recipient2: TransactionSigner
  let airdropStatePda: Address

  const recipient1Amount = 100000000 // 0.1 SOL
  const recipient2Amount = 200000000 // 0.2 SOL
  const totalAmount = recipient1Amount + recipient2Amount // 0.3 SOL

  let merkleTreeResult: { merkleRoot: string; merkleTree: GillMerkleTree }
  let recipients: GillRecipient[]

  beforeAll(async () => {
    client = createSolanaClient({ urlOrMoniker: NETWORK })
    ;({ rpc, sendAndConfirmTransaction } = client)

    const walletData = fs.readFileSync('./deploy-wallet.json', 'utf8')
    const walletArray = JSON.parse(walletData)
    const walletBytes = new Uint8Array(walletArray)
    authority = await createKeyPairSignerFromBytes(walletBytes)

    recipient1 = await generateKeyPairSigner()
    recipient2 = await generateKeyPairSigner()

    console.log('🔧 Test Setup:')
    console.log(`   Authority: ${authority.address}`)
    console.log(`   Recipient 1: ${recipient1.address}`)
    console.log(`   Recipient 2: ${recipient2.address}`)

    try {
      await rpc.requestAirdrop(recipient1.address, lamports(10000000n)).send() // 0.01 SOL
      await rpc.requestAirdrop(recipient2.address, lamports(10000000n)).send() // 0.01 SOL

      await new Promise((resolve) => setTimeout(resolve, 2000))
    } catch (error) {
      console.log('⚠️  Airdrop funding failed (continuing anyway):', error)
    }

    const recipientsData = {
      recipients: [
        { publicKey: recipient1.address, amount: recipient1Amount.toString() },
        { publicKey: recipient2.address, amount: recipient2Amount.toString() },
      ],
    }

    merkleTreeResult = generateGillMerkleTree(recipientsData)
    console.log(`🌳 Merkle Root: ${merkleTreeResult.merkleRoot}`)

    const [derivedPda] = await getProgramDerivedAddress({
      programAddress: SOLANA_DISTRIBUTOR_PROGRAM_ADDRESS,
      seeds: ['merkle_tree'],
    })
    airdropStatePda = address(derivedPda)
    console.log(`🏛️  Airdrop State PDA: ${airdropStatePda}`)
  })

  test('Initialize airdrop with Merkle tree (Gill + Codama)', async () => {
    console.log('\n🚀 Testing airdrop initialization...')

    try {
      const existingState = await fetchAirdropState(rpc, airdropStatePda)
      if (existingState) {
        console.log('✅ Airdrop already initialized, skipping...')
        expect(existingState.data.merkleRoot).toEqual(Array.from(merkleTreeResult.merkleTree.root))
        expect(existingState.data.authority.toString()).toBe(authority.address)
        expect(Number(existingState.data.airdropAmount)).toBe(totalAmount)
        return
      }
    } catch {
      // Not initialized yet, continue
    }

    const initializeInstruction = getInitializeAirdropInstruction({
      airdropState: airdropStatePda,
      authority: authority,
      merkleRoot: new Uint8Array(merkleTreeResult.merkleTree.root),
      amount: BigInt(totalAmount),
    })

    const { value: latestBlockhash } = await rpc.getLatestBlockhash().send()

    const transaction = createTransaction({
      version: 'legacy',
      feePayer: authority,
      instructions: [initializeInstruction],
      latestBlockhash,
    })

    const signature = await sendAndConfirmTransaction(transaction)
    console.log(`📋 Initialize signature: ${signature}`)

    const airdropState = await fetchAirdropState(rpc, airdropStatePda)
    expect(airdropState).toBeTruthy()
    expect(airdropState!.data.merkleRoot).toEqual(Array.from(merkleTreeResult.merkleTree.root))
    expect(airdropState!.data.authority.toString()).toBe(authority.address)
    expect(Number(airdropState!.data.airdropAmount)).toBe(totalAmount)
    expect(Number(airdropState!.data.amountClaimed)).toBe(0)

    const vaultBalance = await rpc.getBalance(airdropStatePda).send()
    console.log(`💰 Vault balance: ${Number(vaultBalance.value) / 1e9} SOL`)
    expect(Number(vaultBalance.value)).toBeGreaterThan(0)
  })

  test('Claim SOL - Recipient 1 (Gill + Codama)', async () => {
    console.log('\n🎯 Testing claim for Recipient 1...')

    const proofResult = generateGillProof(merkleTreeResult.merkleTree, 0)
    console.log(`🔐 Proof length: ${proofResult.proof.length}`)

    const [claimStatusPda] = await getProgramDerivedAddress({
      programAddress: SOLANA_DISTRIBUTOR_PROGRAM_ADDRESS,
      seeds: ['claim', airdropStatePda, recipient1.address],
    })

    try {
      const existingClaim = await fetchClaimStatus(rpc, address(claimStatusPda))
      if (existingClaim) {
        console.log('✅ Recipient 1 already claimed, skipping...')
        return
      }
    } catch {
      // Not claimed yet, continue
    }

    const balanceBefore = await rpc.getBalance(recipient1.address).send()
    console.log(`💰 Recipient 1 balance before: ${Number(balanceBefore.value) / 1e9} SOL`)

    const claimInstruction = getClaimAirdropInstruction({
      airdropState: airdropStatePda,
      userClaim: address(claimStatusPda),
      signer: recipient1,
      proof: proofResult.proof.map((p) => new Uint8Array(Buffer.from(p.slice(2), 'hex'))),
      amount: BigInt(recipient1Amount),
      leafIndex: 0,
    })

    const { value: latestBlockhash } = await rpc.getLatestBlockhash().send()
    const transaction = createTransaction({
      version: 'legacy',
      feePayer: recipient1,
      instructions: [claimInstruction],
      latestBlockhash,
    })

    const signature = await sendAndConfirmTransaction(transaction)
    console.log(`📋 Claim signature: ${signature}`)

    const balanceAfter = await rpc.getBalance(recipient1.address).send()
    console.log(`💰 Recipient 1 balance after: ${Number(balanceAfter.value) / 1e9} SOL`)

    const balanceIncrease = Number(balanceAfter.value) - Number(balanceBefore.value)
    expect(balanceIncrease).toBeCloseTo(recipient1Amount, -5) // Allow for transaction fees

    const claimStatus = await fetchClaimStatus(rpc, address(claimStatusPda))
    expect(claimStatus).toBeTruthy() // Account exists = claimed
  })

  test('Claim SOL - Recipient 2 (Gill + Codama)', async () => {
    console.log('\n🎯 Testing claim for Recipient 2...')

    const proofResult = generateGillProof(merkleTreeResult.merkleTree, 1)
    console.log(`🔐 Proof length: ${proofResult.proof.length}`)

    const [claimStatusPda] = await getProgramDerivedAddress({
      programAddress: SOLANA_DISTRIBUTOR_PROGRAM_ADDRESS,
      seeds: ['claim', airdropStatePda, recipient2.address],
    })

    try {
      const existingClaim = await fetchClaimStatus(rpc, address(claimStatusPda))
      if (existingClaim) {
        console.log('✅ Recipient 2 already claimed, skipping...')
        return
      }
    } catch {
      // Not claimed yet, continue
    }

    const balanceBefore = await rpc.getBalance(recipient2.address).send()
    console.log(`💰 Recipient 2 balance before: ${Number(balanceBefore.value) / 1e9} SOL`)

    const claimInstruction = getClaimAirdropInstruction({
      airdropState: airdropStatePda,
      userClaim: address(claimStatusPda),
      signer: recipient2,
      proof: proofResult.proof.map((p) => new Uint8Array(Buffer.from(p.slice(2), 'hex'))),
      amount: BigInt(recipient2Amount),
      leafIndex: 1,
    })

    const { value: latestBlockhash } = await rpc.getLatestBlockhash().send()
    const transaction = createTransaction({
      version: 'legacy',
      feePayer: recipient2,
      instructions: [claimInstruction],
      latestBlockhash,
    })

    const signature = await sendAndConfirmTransaction(transaction)
    console.log(`📋 Claim signature: ${signature}`)

    const balanceAfter = await rpc.getBalance(recipient2.address).send()
    console.log(`💰 Recipient 2 balance after: ${Number(balanceAfter.value) / 1e9} SOL`)

    const balanceIncrease = Number(balanceAfter.value) - Number(balanceBefore.value)
    expect(balanceIncrease).toBeCloseTo(recipient2Amount, -5) // Allow for transaction fees

    const claimStatus = await fetchClaimStatus(rpc, address(claimStatusPda))
    expect(claimStatus).toBeTruthy() // Account exists = claimed
  })

  test('Should fail to claim twice (Gill + Codama)', async () => {
    console.log('\n🚫 Testing double-claim prevention...')

    const proofResult = generateGillProof(merkleTreeResult.merkleTree, 0)

    const [claimStatusPda] = await getProgramDerivedAddress({
      programAddress: SOLANA_DISTRIBUTOR_PROGRAM_ADDRESS,
      seeds: ['claim', airdropStatePda, recipient1.address],
    })

    const claimInstruction = getClaimAirdropInstruction({
      airdropState: airdropStatePda,
      userClaim: address(claimStatusPda),
      signer: recipient1,
      proof: proofResult.proof.map((p) => new Uint8Array(Buffer.from(p.slice(2), 'hex'))),
      amount: BigInt(recipient1Amount),
      leafIndex: 0,
    })

    const { value: latestBlockhash } = await rpc.getLatestBlockhash().send()
    const transaction = createTransaction({
      version: 'legacy',
      feePayer: recipient1,
      instructions: [claimInstruction],
      latestBlockhash,
    })

    await expect(sendAndConfirmTransaction(transaction)).rejects.toThrow()
    console.log('✅ Double-claim correctly prevented!')
  })
})
