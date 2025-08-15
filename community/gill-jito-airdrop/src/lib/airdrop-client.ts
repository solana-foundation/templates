/**
 * Airdrop Client
 * Core logic for claiming airdrops on Solana
 */

import {
  createSolanaClient,
  getProgramDerivedAddress,
  address,
  createTransaction,
  createKeyPairSignerFromBytes,
} from 'gill'
import bs58 from 'bs58'
import { generateProofForRecipient } from './merkle-tree'
import { serializeClaimInstructionData, ACCOUNT_ROLES, PROGRAM_ADDRESSES } from './airdrop-instructions'
import { AIRDROP_CONFIG } from './config'

export interface AirdropClaimConfig {
  privateKey: string
  network: 'devnet' | 'mainnet' | 'testnet'
}

export interface ClaimResult {
  signature: string
  amount: string
  recipient: string
}

interface SolanaClientInstance {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rpc: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendAndConfirmTransaction: any
}

function createClientInstance(network: string): SolanaClientInstance {
  const client = createSolanaClient({
    urlOrMoniker: network,
  })

  return {
    rpc: client.rpc,
    sendAndConfirmTransaction: client.sendAndConfirmTransaction,
  }
}

export async function checkClaimStatus(config: AirdropClaimConfig, privateKey: string): Promise<boolean> {
  const clientInstance = createClientInstance(config.network)

  const privateKeyBytes = bs58.decode(privateKey)
  const signer = await createKeyPairSignerFromBytes(privateKeyBytes)

  const programAddress = address(AIRDROP_CONFIG.AIRDROP_PROGRAM_ID!)
  const [airdropStatePda] = await getProgramDerivedAddress({
    programAddress,
    seeds: ['merkle_tree'],
  })

  const [userClaimPda] = await getProgramDerivedAddress({
    programAddress,
    seeds: ['claim', bs58.decode(airdropStatePda), bs58.decode(signer.address)],
  })

  try {
    const accountInfo = await clientInstance.rpc.getAccountInfo(address(userClaimPda)).send()
    return accountInfo.value !== null // If account exists, airdrop has been claimed
  } catch {
    return false
  }
}

export async function claimAirdrop(config: AirdropClaimConfig, privateKey: string): Promise<ClaimResult> {
  const clientInstance = createClientInstance(config.network)

  const privateKeyBytes = bs58.decode(privateKey)
  const signer = await createKeyPairSignerFromBytes(privateKeyBytes)

  const alreadyClaimed = await checkClaimStatus(config, privateKey)
  if (alreadyClaimed) {
    throw new Error('Airdrop has already been claimed for this address')
  }

  await validateClaim(clientInstance, signer.address)

  const proof = generateProofForRecipient(signer.address)
  if (!proof) {
    throw new Error(`Address ${signer.address} is not eligible for this airdrop`)
  }

  const programAddress = address(AIRDROP_CONFIG.AIRDROP_PROGRAM_ID!)
  const [airdropStatePda] = await getProgramDerivedAddress({
    programAddress,
    seeds: ['merkle_tree'],
  })

  const [userClaimPda] = await getProgramDerivedAddress({
    programAddress,
    seeds: ['claim', bs58.decode(airdropStatePda), bs58.decode(signer.address)],
  })

  const signature = await sendClaimTransaction(clientInstance, {
    signer,
    programAddress,
    airdropStatePda,
    userClaimPda,
    proof,
  })

  return {
    signature,
    amount: proof.amount,
    recipient: proof.recipient,
  }
}

async function validateClaim(clientInstance: SolanaClientInstance, signerAddress: string): Promise<void> {
  const balance = await clientInstance.rpc.getBalance(address(signerAddress)).send()
  const balanceLamports = Number(balance.value)

  const minBalanceLamports = AIRDROP_CONFIG.MIN_SOL_BALANCE * 1e9
  if (balanceLamports < minBalanceLamports) {
    throw new Error(
      `Insufficient SOL balance: ${balanceLamports / 1e9} SOL. Need at least ${AIRDROP_CONFIG.MIN_SOL_BALANCE} SOL for transaction fees.`,
    )
  }

  const proof = generateProofForRecipient(signerAddress)
  if (!proof) {
    throw new Error(`Address ${signerAddress} is not eligible for this airdrop`)
  }
}

async function sendClaimTransaction(
  clientInstance: SolanaClientInstance,
  params: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    signer: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    programAddress: any
    airdropStatePda: string
    userClaimPda: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    proof: any
  },
): Promise<string> {
  const { signer, programAddress, airdropStatePda, userClaimPda, proof } = params

  const instructionData = serializeClaimInstructionData({
    amount: proof.amount,
    proof: proof.proof,
    leafIndex: proof.leafIndex,
  })

  const { value: latestBlockhash } = await clientInstance.rpc.getLatestBlockhash().send()

  const transaction = createTransaction({
    version: 'legacy',
    feePayer: signer,
    instructions: [
      {
        programAddress,
        accounts: [
          { address: address(airdropStatePda), role: ACCOUNT_ROLES.WRITABLE },
          { address: address(userClaimPda), role: ACCOUNT_ROLES.WRITABLE },
          { address: signer.address, role: ACCOUNT_ROLES.WRITABLE_SIGNER },
          { address: address(PROGRAM_ADDRESSES.SYSTEM_PROGRAM), role: ACCOUNT_ROLES.READONLY },
        ],
        data: instructionData,
      },
    ],
    latestBlockhash,
  })

  const signature = await clientInstance.sendAndConfirmTransaction(transaction)
  return signature
}
