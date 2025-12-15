/**
 * Airdrop Client
 * Core logic for claiming airdrops on Solana
 */

import {
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  getProgramDerivedAddress,
  address,
  createTransactionMessage,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstruction,
  compileTransaction,
  signTransaction,
  getSignatureFromTransaction,
  createKeyPairSignerFromBytes,
  sendAndConfirmTransactionFactory,
  pipe,
} from '@solana/kit'
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

const NETWORK_CONFIG: Record<string, { http: string; ws: string }> = {
  devnet: {
    http: 'https://api.devnet.solana.com',
    ws: 'wss://api.devnet.solana.com',
  },
  testnet: {
    http: 'https://api.testnet.solana.com',
    ws: 'wss://api.testnet.solana.com',
  },
  mainnet: {
    http: 'https://api.mainnet-beta.solana.com',
    ws: 'wss://api.mainnet-beta.solana.com',
  },
}

function createClientInstance(network: string) {
  const config = NETWORK_CONFIG[network] || NETWORK_CONFIG.devnet
  const rpc = createSolanaRpc(config.http)
  const rpcSubscriptions = createSolanaRpcSubscriptions(config.ws)
  const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions })

  return {
    rpc,
    sendAndConfirmTransaction,
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function validateClaim(clientInstance: any, signerAddress: string): Promise<void> {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clientInstance: any,
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

  const instruction = {
    programAddress,
    accounts: [
      { address: address(airdropStatePda), role: ACCOUNT_ROLES.WRITABLE },
      { address: address(userClaimPda), role: ACCOUNT_ROLES.WRITABLE },
      { address: signer.address, role: ACCOUNT_ROLES.WRITABLE_SIGNER },
      { address: address(PROGRAM_ADDRESSES.SYSTEM_PROGRAM), role: ACCOUNT_ROLES.READONLY },
    ],
    data: instructionData,
  }

  const transactionMessage = pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => setTransactionMessageFeePayer(signer.address, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    (tx) => appendTransactionMessageInstruction(instruction, tx),
  )

  const compiledTransaction = compileTransaction(transactionMessage)
  const signedTransaction = await signTransaction([signer.keyPair], compiledTransaction)

  await clientInstance.sendAndConfirmTransaction(signedTransaction, { commitment: 'confirmed' })

  const signature = getSignatureFromTransaction(signedTransaction)
  return signature
}
