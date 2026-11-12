/**
 * Airdrop Instruction Utilities
 * Handles serialization of instruction data for the airdrop program
 */

import { Endian, getU32Encoder, getU64Encoder } from '@solana/kit'
import type { ExactAmount } from '../../types'
import { toU64 } from './merkle-tree'

export interface ClaimAirdropArgs {
  amount: ExactAmount
  proof: number[][]
  leafIndex: ExactAmount
}

/**
 * Serializes claim airdrop instruction data
 * This handles the complex binary serialization required by the Solana program
 */
export function serializeClaimInstructionData(args: ClaimAirdropArgs): Uint8Array {
  const { amount, proof, leafIndex } = args
  if (
    !Array.isArray(proof) ||
    proof.length > 64 ||
    Array.from(proof).some(
      (node) =>
        !Array.isArray(node) ||
        node.length !== 32 ||
        Array.from(node).some((byte) => !Number.isInteger(byte) || byte < 0 || byte > 255),
    )
  ) {
    throw new RangeError('Proof must contain at most 64 hashes of 32 bytes')
  }
  const index = toU64(leafIndex)
  if (index >> BigInt(proof.length)) throw new RangeError('Leaf index exceeds proof depth')

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
    ...getU64Encoder({ endian: Endian.Little }).encode(toU64(amount)),

    // Proof length (4 bytes as u32)
    ...getU32Encoder({ endian: Endian.Little }).encode(proof.length),

    // Proof data (variable length) - flattened array of 32-byte hashes
    ...proof.flat(),

    // Leaf index (8 bytes as u64)
    ...getU64Encoder({ endian: Endian.Little }).encode(index),
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
  AIRDROP_PROGRAM: '6Gs656WdKHM2XuZU3CZQ7SJNo63FecawsLECE6wFnozT',
  SYSTEM_PROGRAM: '11111111111111111111111111111111',
} as const
