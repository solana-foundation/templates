import { keccak_256 } from 'js-sha3'
import { Endian, getAddressEncoder, getU64Encoder, type Address } from '@solana/kit'
import type { ExactAmount, Recipient } from '../../types'
import { RECIPIENTS_DATA, RecipientsFile } from './recipients'

export interface MerkleTreeData {
  root: Uint8Array
  leaves: Uint8Array[]
  tree: Uint8Array[][]
}

export function toU64(value: ExactAmount): bigint {
  if (typeof value === 'number' && !Number.isSafeInteger(value)) {
    throw new RangeError('Numeric u64 input must be a safe integer')
  }
  if (typeof value === 'string' && !/^\d+$/.test(value)) {
    throw new TypeError('u64 string must contain decimal digits only')
  }
  if (!['bigint', 'string', 'number'].includes(typeof value)) {
    throw new TypeError('Expected bigint, decimal string, or safe integer')
  }
  const result = BigInt(value)
  if (result < 0n || result > 0xffffffffffffffffn) throw new RangeError('u64 out of range')
  return result
}

export function createLeaf(recipient: Address, amount: ExactAmount, isClaimed = false): Uint8Array {
  const data = new Uint8Array(41)
  data.set(getAddressEncoder().encode(recipient), 0)
  data.set(getU64Encoder({ endian: Endian.Little }).encode(toU64(amount)), 32)
  data[40] = isClaimed ? 1 : 0
  return new Uint8Array(keccak_256.arrayBuffer(data))
}

export function hashPair(left: Uint8Array, right: Uint8Array): Uint8Array {
  if (left.length !== 32 || right.length !== 32) throw new RangeError('Hashes must be 32 bytes')
  const data = new Uint8Array(64)
  data.set(left)
  data.set(right, 32)
  return new Uint8Array(keccak_256.arrayBuffer(data))
}

export function buildMerkleTree(recipients: Recipient[]): MerkleTreeData {
  if (recipients.length === 0) throw new RangeError('Cannot build an empty Merkle tree')
  const leaves = recipients.map((r) => createLeaf(r.recipient, r.amount))
  const tree = [leaves]
  let currentLevel = leaves

  while (currentLevel.length > 1) {
    const nextLevel: Uint8Array[] = []

    for (let i = 0; i < currentLevel.length; i += 2) {
      const left = currentLevel[i]
      const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left
      const parent = hashPair(left, right)
      nextLevel.push(parent)
    }

    tree.push(nextLevel)
    currentLevel = nextLevel
  }

  const root = currentLevel[0]

  return {
    root,
    leaves,
    tree,
  }
}

export function getProofFromTree(treeData: MerkleTreeData, leafIndex: number): Uint8Array[] {
  if (!Number.isSafeInteger(leafIndex) || leafIndex < 0 || leafIndex >= treeData.leaves.length) {
    throw new RangeError('Leaf index out of range')
  }
  const proof: Uint8Array[] = []
  let index = leafIndex

  for (let level = 0; level < treeData.tree.length - 1; level++) {
    const currentLevel = treeData.tree[level]
    const siblingIndex = index % 2 === 0 ? index + 1 : index - 1

    // Odd levels hash the final node with itself, so include that duplicated sibling.
    proof.push(currentLevel[siblingIndex] ?? currentLevel[index])

    index = Math.floor(index / 2)
  }

  return proof
}

export function getRootHex(root: Uint8Array): string {
  return '0x' + Array.from(root, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function getLeafCount(leaves: Uint8Array[]): number {
  return leaves.length
}

export async function generateMerkleTree() {
  try {
    const recipientsData = loadRecipients()

    const recipients: Recipient[] = recipientsData.recipients.map((r) => ({
      recipient: r.publicKey as Address,
      amount: toU64(r.amount),
    }))

    const merkleTreeData = buildMerkleTree(recipients)
    const merkleRootHex = getRootHex(merkleTreeData.root)

    return {
      merkleTree: merkleTreeData,
      merkleRoot: merkleRootHex,
      recipients,
    }
  } catch (error) {
    console.error('Error generating merkle tree:', error)
    throw error
  }
}

export function generateProofForRecipient(recipientPublicKey: string): {
  proof: number[][]
  leafIndex: number
  amount: string
  recipient: string
} | null {
  try {
    const recipientsData = loadRecipients()

    const recipientInfo = recipientsData.recipients.find((r) => r.publicKey === recipientPublicKey)
    if (!recipientInfo) {
      console.error(`Recipient ${recipientPublicKey} not found in recipients list`)
      return null
    }

    const recipients: Recipient[] = recipientsData.recipients.map((r) => ({
      recipient: r.publicKey as Address,
      amount: toU64(r.amount),
    }))

    const merkleTreeData = buildMerkleTree(recipients)

    const leafIndex = recipientsData.recipients.indexOf(recipientInfo)
    if (recipientInfo.index !== leafIndex) throw new RangeError('Recipient index does not match tree order')
    const proof = getProofFromTree(merkleTreeData, leafIndex)

    const proofArray = proof.map((p) => Array.from(p))

    return {
      proof: proofArray,
      leafIndex,
      amount: recipientInfo.amount,
      recipient: recipientPublicKey,
    }
  } catch (error) {
    console.error('Error generating proof:', error)
    return null
  }
}

export function generateAllProofs() {
  try {
    const recipientsData = loadRecipients()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const proofs: { [key: string]: any } = {}

    for (const recipient of recipientsData.recipients) {
      const proof = generateProofForRecipient(recipient.publicKey)
      if (proof) {
        proofs[recipient.publicKey] = proof
      }
    }

    return proofs
  } catch (error) {
    console.error('Error generating proofs:', error)
    throw error
  }
}

export function loadRecipients(): RecipientsFile {
  try {
    return RECIPIENTS_DATA
  } catch (error) {
    console.error('Error loading recipients:', error)
    throw error
  }
}
