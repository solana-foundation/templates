import { keccak_256 } from 'js-sha3'
import { Address } from 'gill'
import bs58 from 'bs58'
import { Recipient } from '../../types'
import { RECIPIENTS_DATA, RecipientsFile } from './recipients'

export interface MerkleTreeData {
  root: Uint8Array
  leaves: Uint8Array[]
  tree: Uint8Array[][]
}

function createLeaf(recipient: Address, amount: number): Uint8Array {
  // Convert Address (string) to bytes - Address is base58 encoded
  const recipientBytes = Buffer.from(bs58.decode(recipient))

  const data = Buffer.concat([
    recipientBytes,
    Buffer.from(new Uint8Array(new BigUint64Array([BigInt(amount)]).buffer)),
    Buffer.from([0]),
  ])
  return new Uint8Array(keccak_256.arrayBuffer(data))
}

function hashPair(left: Uint8Array, right: Uint8Array): Uint8Array {
  const data = Buffer.concat([Buffer.from(left), Buffer.from(right)])
  return new Uint8Array(keccak_256.arrayBuffer(data))
}

export function buildMerkleTree(recipients: Recipient[]): MerkleTreeData {
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
  const proof: Uint8Array[] = []
  let index = leafIndex

  for (let level = 0; level < treeData.tree.length - 1; level++) {
    const currentLevel = treeData.tree[level]
    const siblingIndex = index % 2 === 0 ? index + 1 : index - 1

    if (siblingIndex < currentLevel.length) {
      proof.push(currentLevel[siblingIndex])
    }

    index = Math.floor(index / 2)
  }

  return proof
}

export function getRootHex(root: Uint8Array): string {
  return '0x' + Buffer.from(root).toString('hex')
}

export function getLeafCount(leaves: Uint8Array[]): number {
  return leaves.length
}

export async function generateMerkleTree() {
  try {
    const recipientsData = loadRecipients()

    const recipients: Recipient[] = recipientsData.recipients.map((r) => ({
      recipient: r.publicKey as Address,
      amount: parseInt(r.amount),
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
      amount: parseInt(r.amount),
    }))

    const merkleTreeData = buildMerkleTree(recipients)

    const leafIndex = recipientInfo.index
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
