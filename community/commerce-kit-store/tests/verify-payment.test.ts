import { describe, expect, it, vi } from 'vitest'
import { usdcMinorUnits, verifyUsdcPayment } from '../src/lib/verify-payment'

const recipient = '11111111111111111111111111111112'
const mint = '11111111111111111111111111111113'
const reference = '11111111111111111111111111111114'
const txSignature = '1'.repeat(64)
const expected = { recipient, mint, reference, amount: 1_000_000n }

function transaction() {
  return {
    version: 1,
    blockTime: 123n,
    transaction: { message: { accountKeys: [{ pubkey: reference }] } },
    meta: {
      err: null,
      preTokenBalances: [{ accountIndex: 1, owner: recipient, mint, uiTokenAmount: { amount: '5000000' } }],
      postTokenBalances: [{ accountIndex: 1, owner: recipient, mint, uiTokenAmount: { amount: '6000000' } }],
    },
  }
}

async function verify(value: unknown) {
  const getTransaction = vi.fn(() => ({ send: vi.fn().mockResolvedValue(value) }))
  const rpc = { getTransaction } as unknown as Parameters<typeof verifyUsdcPayment>[0]
  const result = await verifyUsdcPayment(rpc, txSignature, expected)
  expect(getTransaction).toHaveBeenCalledWith(txSignature, {
    encoding: 'jsonParsed',
    commitment: 'confirmed',
    maxSupportedTransactionVersion: 1,
  })
  return result
}

describe('V1 USDC payment verification', () => {
  it('accepts a successful transaction with the required received amount', async () => {
    expect((await verify(transaction())).verified).toBe(true)
  })
  it('accepts a newly created recipient token account', async () => {
    const tx = transaction()
    tx.meta.preTokenBalances = []
    tx.meta.postTokenBalances[0].uiTokenAmount.amount = '1000000'
    expect((await verify(tx)).verified).toBe(true)
  })
  it('rejects an existing balance without a transfer', async () => {
    const tx = transaction()
    tx.meta.postTokenBalances[0].uiTokenAmount.amount = '5000000'
    expect((await verify(tx)).verified).toBe(false)
  })
  it('rejects insufficient received funds', async () => {
    const tx = transaction()
    tx.meta.postTokenBalances[0].uiTokenAmount.amount = '5999999'
    expect((await verify(tx)).verified).toBe(false)
  })
  it('rejects zero-net consolidation when the source merchant account is closed', async () => {
    const tx = transaction()
    tx.meta.postTokenBalances = [{ accountIndex: 2, owner: recipient, mint, uiTokenAmount: { amount: '5000000' } }]
    expect((await verify(tx)).verified).toBe(false)
  })
  it('counts actual receipts even when a merchant account is closed', async () => {
    const tx = transaction()
    tx.meta.postTokenBalances[0].accountIndex = 2
    expect((await verify(tx)).verified).toBe(true)
  })
  it.each(['owner', 'mint'] as const)('rejects the wrong %s', async (field) => {
    const tx = transaction()
    tx.meta.postTokenBalances[0][field] = reference
    expect((await verify(tx)).verified).toBe(false)
  })
  it('requires the checkout reference', async () => {
    const tx = transaction()
    tx.transaction.message.accountKeys = []
    expect((await verify(tx)).verified).toBe(false)
  })
  it('rejects failed transactions even with a block time', async () => {
    const tx = { ...transaction(), meta: { ...transaction().meta, err: { InstructionError: [0, 'error'] } } }
    expect((await verify(tx)).verified).toBe(false)
  })
  it('retries when the transaction is not yet available', async () => {
    expect(await verify(null)).toMatchObject({ verified: false, retryable: true })
  })
  it('keeps amounts exact above the safe-number limit', async () => {
    const tx = transaction()
    tx.meta.preTokenBalances[0].uiTokenAmount.amount = '9007199254740993'
    tx.meta.postTokenBalances[0].uiTokenAmount.amount = '9007199255740993'
    expect((await verify(tx)).verified).toBe(true)
  })
})

describe('USDC minor units', () => {
  it.each([
    [9.99, 9_990_000n],
    [0.000001, 1n],
    [1, 1_000_000n],
  ])('converts %s USDC', (value, expected) => {
    expect(usdcMinorUnits(value)).toBe(expected)
  })
  it.each([0, -1, NaN, Infinity, Number.MAX_SAFE_INTEGER])('rejects invalid amount %s', (value) => {
    expect(() => usdcMinorUnits(value)).toThrow()
  })
})
