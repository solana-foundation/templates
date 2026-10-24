import { describe, expect, it, vi } from 'vitest'
import { address } from '@solana/kit'
import { keccak_256 } from 'js-sha3'
import { buildMerkleTree, createLeaf, getProofFromTree, getRootHex, toU64 } from '../src/lib/merkle-tree'
import { serializeClaimInstructionData } from '../src/lib/airdrop-instructions'
import {
  createGillLeafHash,
  generateGillMerkleTree,
  generateGillProof,
  GillMerkleTree,
  verifyGillProof,
} from '../anchor/lib/merkle-tree-manager'
import type { ExactAmount, Recipient } from '../types'

const recipient = address('11111111111111111111111111111111')
const maxU64 = 18446744073709551615n
const hash = (bytes: Uint8Array) => new Uint8Array(keccak_256.arrayBuffer(bytes))

// Independent translation of the Rust verifier, intentionally not using hashPair.
function rustRoot(leaf: Uint8Array, proof: Uint8Array[], index: number): Uint8Array {
  let current = leaf
  for (const sibling of proof) {
    current = hash(new Uint8Array(index % 2 === 0 ? [...current, ...sibling] : [...sibling, ...current]))
    index = Math.floor(index / 2)
  }
  return current
}

describe('ordered Merkle proofs', () => {
  it.each([1, 3, 5])('verifies every recipient in a %i-leaf tree', (count) => {
    const recipients: Recipient[] = Array.from({ length: count }, (_, i) => ({
      recipient,
      amount: (maxU64 - BigInt(i)).toString(),
    }))
    const browser = buildMerkleTree(recipients)
    const scripts = new GillMerkleTree(recipients)
    expect(scripts.getRootHex()).toBe(getRootHex(browser.root))
    expect(scripts.getLeafCount()).toBe(count)
    for (let index = 0; index < count; index++) {
      const proof = getProofFromTree(browser, index)
      expect(proof).toHaveLength(Math.ceil(Math.log2(count)))
      expect(rustRoot(browser.leaves[index], proof, index)).toEqual(browser.root)
      expect(scripts.getProof(index)).toEqual(proof)
      const generated = generateGillProof(scripts, index)
      expect(verifyGillProof(generated.proof, generated.leaf, scripts.getRootHex(), index)).toBe(true)
      expect(verifyGillProof(generated.proof, generated.leaf, scripts.getRootHex(), String(index))).toBe(true)
      expect(verifyGillProof(generated.proof, generated.leaf, scripts.getRootHex(), BigInt(index))).toBe(true)
      if (count > 1) {
        expect(verifyGillProof(generated.proof, generated.leaf, scripts.getRootHex(), index === 0 ? 1 : 0)).toBe(false)
        expect(verifyGillProof(generated.proof.slice(1), generated.leaf, scripts.getRootHex(), index)).toBe(false)
        const changed = proof.map((node) => node.slice())
        changed[0][0] ^= 1
        expect(verifyGillProof(changed.map(getRootHex), generated.leaf, scripts.getRootHex(), index)).toBe(false)
      }
    }
    if (count > 1) {
      expect(getProofFromTree(browser, count - 1)[0]).toEqual(browser.leaves[count - 1])
    }
    if (count === 5) {
      expect(getProofFromTree(browser, 4)[1]).toEqual(browser.tree[1][2])
    }
  })

  it('rejects empty trees and invalid indices', () => {
    expect(() => buildMerkleTree([])).toThrow()
    expect(() => new GillMerkleTree([])).toThrow()
    const data = buildMerkleTree([{ recipient, amount: 1 }])
    for (const index of [-1, 1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
      expect(() => getProofFromTree(data, index)).toThrow()
      expect(() => new GillMerkleTree([{ recipient, amount: 1 }]).getProof(index)).toThrow()
    }
  })

  it('rejects malformed hex, omitted indices, excessive depth, and wrong roots', () => {
    const leaf = createGillLeafHash(recipient, 1)
    expect(verifyGillProof([], leaf, leaf, 0)).toBe(true)
    // @ts-expect-error An index is required; malformed JavaScript calls fail closed.
    expect(verifyGillProof([], leaf, leaf)).toBe(false)
    expect(verifyGillProof([], leaf, leaf, 1)).toBe(false)
    expect(verifyGillProof([], leaf, createGillLeafHash(recipient, 2), 0)).toBe(false)
    for (const malformed of ['', '0x00', '0x' + 'zz'.repeat(32), leaf + '00']) {
      expect(verifyGillProof([], malformed, leaf, 0)).toBe(false)
      expect(verifyGillProof([], leaf, malformed, 0)).toBe(false)
      expect(verifyGillProof([malformed], leaf, leaf, 0)).toBe(false)
    }
    expect(verifyGillProof(Array(65).fill(leaf), leaf, leaf, 0)).toBe(false)
    expect(verifyGillProof([], leaf, leaf, -1)).toBe(false)
  })
})

describe('exact u64 inputs and explicit LE bytes', () => {
  it.each([0n, 1n, 9007199254740993n, 0x0102030405060708n, maxU64])('encodes %s without rounding', (amount) => {
    const amountBytes = Uint8Array.from({ length: 8 }, (_, i) => Number((amount >> BigInt(i * 8)) & 255n))
    const preimage = new Uint8Array(41)
    preimage.set(amountBytes, 32)
    expect(createLeaf(recipient, amount)).toEqual(hash(preimage))
    expect(createLeaf(recipient, amount.toString())).toEqual(hash(preimage))
    expect(createGillLeafHash(recipient, amount)).toBe(getRootHex(hash(preimage)))
    preimage[40] = 1
    expect(createGillLeafHash(recipient, amount, true)).toBe(getRootHex(hash(preimage)))
    const instruction = serializeClaimInstructionData({ amount: amount.toString(), proof: [], leafIndex: 0 })
    expect(instruction).toHaveLength(28)
    expect(Array.from(instruction.slice(0, 8))).toEqual([137, 50, 122, 111, 89, 254, 8, 20])
    expect(instruction.slice(8, 16)).toEqual(amountBytes)
    expect(Array.from(instruction.slice(16))).toEqual(Array(12).fill(0))
  })

  it('preserves decimal amounts in the script generation entrypoint', () => {
    const result = generateGillMerkleTree({ recipients: [{ publicKey: recipient, amount: maxU64.toString() }] })
    expect(result.merkleRoot).toBe(createGillLeafHash(recipient, maxU64))
    expect(createLeaf(recipient, 42)).toEqual(createLeaf(recipient, '42'))
  })

  it('serializes proof length, bytes, and large index in LE', () => {
    const proof = Array.from({ length: 64 }, (_, i) => Array(32).fill(i))
    const bytes = serializeClaimInstructionData({ amount: maxU64, proof, leafIndex: maxU64.toString() })
    expect(Array.from(bytes.slice(16, 20))).toEqual([64, 0, 0, 0])
    expect(Array.from(bytes.slice(20, -8))).toEqual(proof.flat())
    expect(Array.from(bytes.slice(-8))).toEqual(Array(8).fill(255))
  })

  it.each([
    -1,
    -1n,
    maxU64 + 1n,
    Number.MAX_SAFE_INTEGER + 1,
    1.5,
    NaN,
    Infinity,
    '',
    ' ',
    '-1',
    '+1',
    '1.0',
    '1e3',
    '0x10',
    '12junk',
    '18446744073709551616',
  ])('rejects invalid u64 %s', (value) => {
    expect(() => toU64(value)).toThrow()
    expect(() => createLeaf(recipient, value)).toThrow()
    expect(() => serializeClaimInstructionData({ amount: value, proof: [], leafIndex: 0 })).toThrow()
    expect(() => serializeClaimInstructionData({ amount: 1, proof: [], leafIndex: value })).toThrow()
  })

  it('rejects invalid addresses and malformed proof bytes', () => {
    expect(() => createLeaf('bad' as typeof recipient, 1)).toThrow()
    for (const proof of [
      [[]],
      [Array(31).fill(0)],
      [Array(33).fill(0)],
      [Array(32).fill(-1)],
      [Array(32).fill(256)],
      [Array(32).fill(0.5)],
      [Array(32)],
      Array(1),
      Array.from({ length: 65 }, () => Array(32).fill(0)),
    ]) {
      expect(() => serializeClaimInstructionData({ amount: 1, proof, leafIndex: 0 })).toThrow()
    }
    expect(() => serializeClaimInstructionData({ amount: 1, proof: [], leafIndex: 1 })).toThrow()
    for (const value of [null, undefined, true, {}]) {
      expect(() => toU64(value as ExactAmount)).toThrow()
    }
  })

  it('works without a Node Buffer global', () => {
    vi.stubGlobal('Buffer', undefined)
    try {
      const tree = new GillMerkleTree([{ recipient, amount: maxU64 }])
      const generated = generateGillProof(tree, 0)
      expect(verifyGillProof(generated.proof, generated.leaf, tree.getRootHex(), 0)).toBe(true)
      expect(serializeClaimInstructionData({ amount: maxU64, proof: [], leafIndex: 0 })).toHaveLength(28)
    } finally {
      vi.unstubAllGlobals()
    }
  })
})
