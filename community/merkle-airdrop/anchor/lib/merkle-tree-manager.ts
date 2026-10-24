import { address, type Address } from '@solana/kit'
import type { GillRecipient } from './types'
import type { ExactAmount } from '../../types'
import {
  buildMerkleTree,
  createLeaf,
  getProofFromTree,
  getRootHex,
  hashPair,
  toU64,
  type MerkleTreeData,
} from '../../src/lib/merkle-tree'

export class GillMerkleTree {
  public root: Uint8Array
  private leaves: Uint8Array[]
  private treeData: MerkleTreeData

  constructor(recipients: GillRecipient[]) {
    this.treeData = buildMerkleTree(recipients)
    this.leaves = this.treeData.leaves
    this.root = this.treeData.root
  }

  public getProof(leafIndex: number): Uint8Array[] {
    return getProofFromTree(this.treeData, leafIndex)
  }

  public getRootHex(): string {
    return getRootHex(this.root)
  }

  public getLeafCount(): number {
    return this.leaves.length
  }

  public getLeafHex(leafIndex: number): string {
    this.getProof(leafIndex)
    return getRootHex(this.leaves[leafIndex])
  }
}

export function generateGillMerkleTree(recipientsData: { recipients: { publicKey: string; amount: ExactAmount }[] }): {
  merkleRoot: string
  merkleTree: GillMerkleTree
} {
  const merkleTree = new GillMerkleTree(
    recipientsData.recipients.map((r) => ({
      recipient: address(r.publicKey),
      amount: toU64(r.amount),
    })),
  )
  return { merkleRoot: merkleTree.getRootHex(), merkleTree }
}

export function generateGillProof(
  merkleTree: GillMerkleTree,
  recipientIndex: number,
): {
  proof: string[]
  leaf: string
} {
  return {
    proof: merkleTree.getProof(recipientIndex).map(getRootHex),
    leaf: merkleTree.getLeafHex(recipientIndex),
  }
}

function decodeHash(hex: string): Uint8Array {
  if (typeof hex !== 'string' || !/^(?:0x)?[0-9a-fA-F]{64}$/.test(hex)) {
    throw new TypeError('Expected a 32-byte hex hash')
  }
  const digits = hex.startsWith('0x') ? hex.slice(2) : hex
  return Uint8Array.from(digits.match(/../g)!, (byte) => Number.parseInt(byte, 16))
}

// Proof order follows the original leaf index, matching the on-chain verifier.
export function verifyGillProof(proof: string[], leaf: string, root: string, leafIndex: ExactAmount): boolean {
  try {
    if (leafIndex === undefined || !Array.isArray(proof) || proof.length > 64) return false
    let index = toU64(leafIndex)
    if (index >> BigInt(proof.length)) return false
    let computed = decodeHash(leaf)
    const expected = decodeHash(root)
    for (const sibling of proof) {
      const node = decodeHash(sibling)
      computed = index % 2n === 0n ? hashPair(computed, node) : hashPair(node, computed)
      index /= 2n
    }
    return computed.every((byte, i) => byte === expected[i])
  } catch {
    return false
  }
}

export function createGillLeafHash(recipient: Address, amount: ExactAmount, isClaimed = false): string {
  return getRootHex(createLeaf(recipient, amount, isClaimed))
}
