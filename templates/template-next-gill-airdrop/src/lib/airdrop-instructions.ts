/**
 * Airdrop Instruction Utilities
 * Handles serialization of instruction data for the airdrop program
 */

export interface ClaimAirdropArgs {
  amount: string
  proof: number[][]
  leafIndex: number
}

/**
 * Serializes claim airdrop instruction data
 * This handles the complex binary serialization required by the Solana program
 */
export function serializeClaimInstructionData(args: ClaimAirdropArgs): Uint8Array {
  const { amount, proof, leafIndex } = args

  return new Uint8Array([
    // Discriminator (8 bytes) - identifies the claim_airdrop instruction
    137,
    50,
    122,
    111,
    89,
    254,
    8,
    20,

    // Amount (8 bytes as u64)
    ...new Uint8Array(new BigUint64Array([BigInt(amount)]).buffer),

    // Proof length (4 bytes as u32)
    ...new Uint8Array(new Uint32Array([proof.length]).buffer),

    // Proof data (variable length) - flattened array of 32-byte hashes
    ...proof.flat(),

    // Leaf index (8 bytes as u64)
    ...new Uint8Array(new BigUint64Array([BigInt(leafIndex)]).buffer),
  ])
}

/**
 * Account roles for Solana instructions
 */
export const ACCOUNT_ROLES = {
  WRITABLE_SIGNER: 3,
  READONLY_SIGNER: 2,
  WRITABLE: 1,
  READONLY: 0,
} as const

/**
 * Program addresses used by the airdrop system
 */
export const PROGRAM_ADDRESSES = {
  AIRDROP_PROGRAM: 'ErbDoJTnJyG6EBXHeFochTsHJhB3Jfjc3MF1L9aNip3y',
  SYSTEM_PROGRAM: '11111111111111111111111111111111',
} as const
