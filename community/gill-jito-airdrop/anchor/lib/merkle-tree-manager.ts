import { keccak_256 } from 'js-sha3'
import type { GillRecipient } from './types'
import { address, type Address } from 'gill'
import bs58 from 'bs58'

export class GillMerkleTree {
  public root: Uint8Array
  private leaves: Uint8Array[]
  private tree: Uint8Array[][]

  constructor(recipients: GillRecipient[]) {
    this.leaves = recipients.map((r) => this.createLeaf(r.recipient, r.amount))

    this.tree = [this.leaves]
    let currentLevel = this.leaves

    while (currentLevel.length > 1) {
      const nextLevel: Uint8Array[] = []

      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i]
        const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left
        const parent = this.hashPair(left, right)
        nextLevel.push(parent)
      }

      this.tree.push(nextLevel)
      currentLevel = nextLevel
    }

    this.root = currentLevel[0]
  }

  private createLeaf(recipient: Address, amount: number): Uint8Array {
    const recipientBytes = bs58.decode(recipient)
    const data = Buffer.concat([
      Buffer.from(recipientBytes),
      Buffer.from(new Uint8Array(new BigUint64Array([BigInt(amount)]).buffer)),
      Buffer.from([0]), // isClaimed = false
    ])
    return new Uint8Array(keccak_256.arrayBuffer(data))
  }

  private hashPair(left: Uint8Array, right: Uint8Array): Uint8Array {
    const data = Buffer.concat([Buffer.from(left), Buffer.from(right)])
    return new Uint8Array(keccak_256.arrayBuffer(data))
  }

  public getProof(leafIndex: number): Uint8Array[] {
    const proof: Uint8Array[] = []
    let index = leafIndex

    for (let level = 0; level < this.tree.length - 1; level++) {
      const currentLevel = this.tree[level]
      const siblingIndex = index % 2 === 0 ? index + 1 : index - 1

      if (siblingIndex < currentLevel.length) {
        proof.push(currentLevel[siblingIndex])
      }

      index = Math.floor(index / 2)
    }

    return proof
  }

  public getRootHex(): string {
    return '0x' + Buffer.from(this.root).toString('hex')
  }

  public getLeafCount(): number {
    return this.leaves.length
  }
}

export function generateGillMerkleTree(recipientsData: { recipients: { publicKey: string; amount: string }[] }): {
  merkleRoot: string
  merkleTree: GillMerkleTree
} {
  try {
    console.log('🌳 Generating Merkle tree with Gill...')

    // Convert to Gill format
    const recipients: GillRecipient[] = recipientsData.recipients.map((r) => ({
      recipient: address(r.publicKey),
      amount: parseInt(r.amount),
    }))

    const merkleTree = new GillMerkleTree(recipients)
    const merkleRootHex = merkleTree.getRootHex()

    console.log(`✅ Gill Merkle tree generated!`)
    console.log(`   Leaves: ${merkleTree.getLeafCount()}`)
    console.log(`   Root: ${merkleRootHex}`)

    return {
      merkleRoot: merkleRootHex,
      merkleTree,
    }
  } catch (error) {
    console.error('❌ Error generating Gill merkle tree:', error)
    throw error
  }
}

export function generateGillProof(
  merkleTree: GillMerkleTree,
  recipientIndex: number,
): {
  proof: string[]
  leaf: string
} {
  try {
    const proof = merkleTree.getProof(recipientIndex)
    const proofHex = proof.map((p) => '0x' + Buffer.from(p).toString('hex'))

    const leaves = (merkleTree as any).leaves as Uint8Array[]
    const leaf = '0x' + Buffer.from(leaves[recipientIndex]).toString('hex')

    return {
      proof: proofHex,
      leaf,
    }
  } catch (error) {
    console.error('❌ Error generating Gill proof:', error)
    throw error
  }
}

export function verifyGillProof(proof: string[], leaf: string, root: string): boolean {
  try {
    let computedHash = Buffer.from(leaf.replace('0x', ''), 'hex')

    for (const proofElement of proof) {
      const proofBuf = Buffer.from(proofElement.replace('0x', ''), 'hex')

      // Determine the order for hashing
      if (Buffer.compare(computedHash, proofBuf) < 0) {
        computedHash = Buffer.from(keccak_256.arrayBuffer(Buffer.concat([computedHash, proofBuf])))
      } else {
        computedHash = Buffer.from(keccak_256.arrayBuffer(Buffer.concat([proofBuf, computedHash])))
      }
    }

    const computedRoot = '0x' + computedHash.toString('hex')
    return computedRoot === root
  } catch (error) {
    console.error('❌ Error verifying Gill proof:', error)
    return false
  }
}

export function createGillLeafHash(recipient: Address, amount: number, isClaimed: boolean = false): string {
  const recipientBytes = bs58.decode(recipient)
  const data = Buffer.concat([
    Buffer.from(recipientBytes),
    Buffer.from(new Uint8Array(new BigUint64Array([BigInt(amount)]).buffer)),
    Buffer.from([isClaimed ? 1 : 0]),
  ])
  return '0x' + Buffer.from(keccak_256.arrayBuffer(data)).toString('hex')
}
