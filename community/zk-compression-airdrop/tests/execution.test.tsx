import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { act, cleanup, renderHook } from '@testing-library/react'
import { useAirdrop } from '../src/features/airdrop/data-access/use-airdrop'
import type { AirdropConfig, AirdropData } from '../src/features/airdrop/data-access/airdrop-types'
import { createSubmissionStore } from '../src/lib/airdrop-submissions'

const mocks = vi.hoisted(() => ({
  prepare: vi.fn(),
  validate: vi.fn(),
  send: vi.fn(),
  connected: { account: { address: 'authority' } },
  state: {} as { connected?: unknown },
  cluster: { id: 'devnet' },
}))
let submissions = createSubmissionStore()
vi.mock('@/components/solana/solana-provider', () => ({
  useSolana: () => ({ client, submissions, cluster: mocks.cluster }),
}))
vi.mock('@solana/kit-plugin-wallet/react', () => ({ useConnectedWallet: () => mocks.state.connected }))
vi.mock('../src/features/airdrop/data-access/airdrop-utils', () => ({
  prepareAirdropBatch: mocks.prepare,
  validateAirdrop: mocks.validate,
  calculateBatches: (count: number, size: number) => Math.ceil(count / size),
}))
const client = { wallet: { getState: () => mocks.state }, sendTransaction: mocks.send }
const config = { network: 'devnet', mintAddress: 'mint' } as AirdropConfig
const useTestAirdrop = () => useAirdrop(config)
const data = { recipients: [{}, {}, {}] } as AirdropData
beforeEach(() => {
  submissions = createSubmissionStore()
  mocks.cluster.id = 'devnet'
  mocks.validate.mockReset().mockReturnValue({ recipients: ['prepared'], amounts: [1n] })
  mocks.state.connected = mocks.connected
  mocks.prepare.mockReset().mockResolvedValue([])
  mocks.send.mockReset().mockResolvedValue({ context: { signature: 'confirmed-signature' } })
})
afterEach(cleanup)

test('serializes batches, tracks confirmations and prevents repeated minting in the same view', async () => {
  const { result } = renderHook(useTestAirdrop)
  await act(async () => {
    await result.current.executeAirdrop(data, 1)
  })
  expect(mocks.send).toHaveBeenCalledTimes(3)
  expect(mocks.validate).toHaveBeenCalledTimes(1)
  expect(mocks.prepare.mock.calls.every((call) => call[2] === mocks.validate.mock.results[0].value)).toBe(true)
  expect(result.current.progress?.successfulMints).toBe(3)
  expect(result.current.requiresReview).toBe(true)
  await act(async () => {
    await result.current.executeAirdrop(data, 1)
  })
  expect(mocks.send).toHaveBeenCalledTimes(3)
})

test('stops after a rejected or uncertain transaction without retrying or marking it successful', async () => {
  mocks.send.mockRejectedValue(new Error('Wallet rejected'))
  const { result } = renderHook(useTestAirdrop)
  await act(async () => {
    await result.current.executeAirdrop(data, 1)
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
  const { result } = renderHook(useTestAirdrop)
  await act(async () => {
    await result.current.executeAirdrop(data, 1)
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
  const { result } = renderHook(useTestAirdrop)
  await act(async () => {
    await result.current.executeAirdrop(data, 1)
  })
  expect(mocks.send).not.toHaveBeenCalled()
  expect(result.current.error).toMatch(/Wallet changed|Wallet or network changed/)
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
  const { result } = renderHook(useTestAirdrop)
  await act(async () => {
    const first = result.current.executeAirdrop(data, 3)
    const duplicate = result.current.executeAirdrop(data, 3)
    finish()
    await first
    await duplicate
  })
  expect(mocks.send).toHaveBeenCalledTimes(1)
})

test('remount preserves submission lock, progress and signatures for the same network and mint', async () => {
  const first = renderHook(useTestAirdrop)
  await act(async () => {
    await first.result.current.executeAirdrop(data, 3)
  })
  first.unmount()
  mocks.cluster.id = 'testnet'
  const other = renderHook(() => useAirdrop({ ...config, network: 'testnet' }))
  expect(other.result.current.requiresReview).toBe(false)
  other.unmount()
  const restored = renderHook(useTestAirdrop)
  expect(restored.result.current.requiresReview).toBe(true)
  expect(restored.result.current.progressCluster).toBe('devnet')
  expect(restored.result.current.progress?.signatures).toEqual(['confirmed-signature'])
  await act(async () => {
    await restored.result.current.executeAirdrop(data, 3)
  })
  expect(mocks.send).toHaveBeenCalledTimes(1)
})

test('a pending submission stays locked across remount and records its late confirmation', async () => {
  let confirm!: (value: { context: { signature: string } }) => void
  mocks.send.mockImplementation(
    () =>
      new Promise((resolve) => {
        confirm = resolve
      }),
  )
  const first = renderHook(useTestAirdrop)
  let pending!: Promise<void>
  await act(async () => {
    pending = first.result.current.executeAirdrop(data, 3)
  })
  first.unmount()
  const restored = renderHook(useTestAirdrop)
  expect(restored.result.current.requiresReview).toBe(true)
  await act(async () => {
    await restored.result.current.executeAirdrop(data, 3)
  })
  expect(mocks.send).toHaveBeenCalledTimes(1)
  await act(async () => {
    confirm({ context: { signature: 'late-confirmed' } })
    await pending
  })
  expect(restored.result.current.progress?.signatures).toEqual(['late-confirmed'])
  expect(restored.result.current.requiresReview).toBe(true)
})
