import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { act, cleanup, renderHook } from '@testing-library/react'
import { useAirdrop } from '../src/features/airdrop/data-access/use-airdrop'
import type { AirdropConfig, AirdropData } from '../src/features/airdrop/data-access/airdrop-types'

const mocks = vi.hoisted(() => ({
  prepare: vi.fn(),
  send: vi.fn(),
  connected: { account: { address: 'authority' } },
  state: {} as { connected?: unknown },
}))
vi.mock('@/components/solana/solana-provider', () => ({ useSolana: () => ({ client }) }))
vi.mock('@solana/kit-plugin-wallet/react', () => ({ useConnectedWallet: () => mocks.state.connected }))
vi.mock('../src/features/airdrop/data-access/airdrop-utils', () => ({
  prepareAirdropBatch: mocks.prepare,
  validateAirdrop: vi.fn(),
  calculateBatches: (count: number, size: number) => Math.ceil(count / size),
}))
const client = { wallet: { getState: () => mocks.state }, sendTransaction: mocks.send }
const config = {} as AirdropConfig
const data = { recipients: [{}, {}, {}] } as AirdropData
beforeEach(() => {
  mocks.state.connected = mocks.connected
  mocks.prepare.mockReset().mockResolvedValue([])
  mocks.send.mockReset().mockResolvedValue({ context: { signature: 'confirmed-signature' } })
})
afterEach(cleanup)

test('serializes batches, tracks confirmations and prevents repeated minting in the same view', async () => {
  const { result } = renderHook(useAirdrop)
  await act(async () => {
    await result.current.executeAirdrop(config, data, 1)
  })
  expect(mocks.send).toHaveBeenCalledTimes(3)
  expect(result.current.progress?.successfulMints).toBe(3)
  expect(result.current.requiresReview).toBe(true)
  await act(async () => {
    await result.current.executeAirdrop(config, data, 1)
  })
  expect(mocks.send).toHaveBeenCalledTimes(3)
})

test('stops after a rejected or uncertain transaction without retrying or marking it successful', async () => {
  mocks.send.mockRejectedValue(new Error('Wallet rejected'))
  const { result } = renderHook(useAirdrop)
  await act(async () => {
    await result.current.executeAirdrop(config, data, 1)
  })
  expect(mocks.send).toHaveBeenCalledTimes(1)
  expect(result.current.error).toContain('Wallet rejected')
  expect(result.current.progress?.successfulMints).toBe(0)
  expect(result.current.isExecuting).toBe(false)
})

test('keeps confirmed progress and stops the remaining batches on failure', async () => {
  mocks.send
    .mockResolvedValueOnce({ context: { signature: 'confirmed' } })
    .mockRejectedValueOnce(new Error('RPC timeout'))
  const { result } = renderHook(useAirdrop)
  await act(async () => {
    await result.current.executeAirdrop(config, data, 1)
  })
  expect(mocks.send).toHaveBeenCalledTimes(2)
  expect(result.current.progress?.signatures).toEqual(['confirmed'])
  expect(result.current.progress?.successfulMints).toBe(1)
  expect(result.current.error).toContain('Check the wallet and on-chain results')
})

test('wallet changes during preparation prevent submission', async () => {
  mocks.prepare.mockImplementation(async () => {
    mocks.state.connected = { account: { address: 'other' } }
    return []
  })
  const { result } = renderHook(useAirdrop)
  await act(async () => {
    await result.current.executeAirdrop(config, data, 1)
  })
  expect(mocks.send).not.toHaveBeenCalled()
  expect(result.current.error).toContain('Wallet changed')
})

test('double click cannot open duplicate requests', async () => {
  let finish!: () => void
  const wait = new Promise<void>((resolve) => {
    finish = resolve
  })
  mocks.prepare.mockImplementation(async () => {
    await wait
    return []
  })
  const { result } = renderHook(useAirdrop)
  await act(async () => {
    const first = result.current.executeAirdrop(config, data, 3)
    const duplicate = result.current.executeAirdrop(config, data, 3)
    finish()
    await first
    await duplicate
  })
  expect(mocks.send).toHaveBeenCalledTimes(1)
})
