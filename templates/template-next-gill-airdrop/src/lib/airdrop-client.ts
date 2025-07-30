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

export class AirdropClient {
  private rpc
  private sendAndConfirmTransaction

  constructor(config: AirdropClaimConfig) {
    const client = createSolanaClient({
      urlOrMoniker: config.network,
    })

    this.rpc = client.rpc
    this.sendAndConfirmTransaction = client.sendAndConfirmTransaction
  }

  /**
   * Checks if an airdrop has already been claimed for the given private key
   */
  async checkClaimStatus(privateKey: string): Promise<boolean> {
    // 1. Create signer from private key
    const privateKeyBytes = bs58.decode(privateKey)
    const signer = await createKeyPairSignerFromBytes(privateKeyBytes)

    // 2. Generate PDAs
    const programAddress = address(AIRDROP_CONFIG.AIRDROP_PROGRAM_ID!)
    const [airdropStatePda] = await getProgramDerivedAddress({
      programAddress,
      seeds: ['merkle_tree'],
    })

    const [userClaimPda] = await getProgramDerivedAddress({
      programAddress,
      seeds: ['claim', bs58.decode(airdropStatePda), bs58.decode(signer.address)],
    })

    // 3. Check if claim account exists
    try {
      const accountInfo = await this.rpc.getAccountInfo(address(userClaimPda)).send()
      return accountInfo.value !== null // If account exists, airdrop has been claimed
    } catch (error) {
      // If account doesn't exist, airdrop hasn't been claimed
      return false
    }
  }

  /**
   * Claims an airdrop for the given private key
   */
  async claimAirdrop(privateKey: string): Promise<ClaimResult> {
    // 1. Create signer from private key
    const privateKeyBytes = bs58.decode(privateKey)
    const signer = await createKeyPairSignerFromBytes(privateKeyBytes)

    // 2. Check if already claimed
    const alreadyClaimed = await this.checkClaimStatus(privateKey)
    if (alreadyClaimed) {
      throw new Error('Airdrop has already been claimed for this address')
    }

    // 3. Validate eligibility and balance
    await this.validateClaim(signer.address)

    // 4. Generate proof
    const proof = generateProofForRecipient(signer.address)
    if (!proof) {
      throw new Error(`Address ${signer.address} is not eligible for this airdrop`)
    }

    // 5. Generate PDAs
    const programAddress = address(AIRDROP_CONFIG.AIRDROP_PROGRAM_ID!)
    const [airdropStatePda] = await getProgramDerivedAddress({
      programAddress,
      seeds: ['merkle_tree'],
    })

    const [userClaimPda] = await getProgramDerivedAddress({
      programAddress,
      seeds: ['claim', bs58.decode(airdropStatePda), bs58.decode(signer.address)],
    })

    // 6. Build and send transaction
    const signature = await this.sendClaimTransaction({
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

  private async validateClaim(signerAddress: string): Promise<void> {
    // Check balance
    const balance = await this.rpc.getBalance(address(signerAddress)).send()
    const balanceLamports = Number(balance.value)

    const minBalanceLamports = AIRDROP_CONFIG.MIN_SOL_BALANCE * 1e9
    if (balanceLamports < minBalanceLamports) {
      throw new Error(
        `Insufficient SOL balance: ${balanceLamports / 1e9} SOL. Need at least ${AIRDROP_CONFIG.MIN_SOL_BALANCE} SOL for transaction fees.`,
      )
    }

    // Check eligibility
    const proof = generateProofForRecipient(signerAddress)
    if (!proof) {
      throw new Error(`Address ${signerAddress} is not eligible for this airdrop`)
    }
  }

  private async sendClaimTransaction(params: {
    signer: any
    programAddress: any
    airdropStatePda: string
    userClaimPda: string
    proof: any
  }): Promise<string> {
    const { signer, programAddress, airdropStatePda, userClaimPda, proof } = params

    // Serialize instruction data
    const instructionData = serializeClaimInstructionData({
      amount: proof.amount,
      proof: proof.proof,
      leafIndex: proof.leafIndex,
    })

    // Get latest blockhash
    const { value: latestBlockhash } = await this.rpc.getLatestBlockhash().send()

    // Build transaction
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

    // Send transaction
    const signature = await this.sendAndConfirmTransaction(transaction)
    return signature
  }
}
