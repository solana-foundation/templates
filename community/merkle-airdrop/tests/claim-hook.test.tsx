// @vitest-environment jsdom
import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { useAirdropClaim } from '../src/hooks/useAirdropClaim'

const mocks = vi.hoisted(() => ({
  prepare: vi.fn(),
  send: vi.fn(),
  wallet: undefined as unknown,
}))
vi.mock('@solana/react', () => ({ useClient: () => ({ sendTransaction: mocks.send }) }))
vi.mock('@solana/kit-plugin-wallet/react', () => ({ useConnectedWallet: () => mocks.wallet }))
vi.mock('@/lib/airdrop-client', () => ({ prepareClaim: mocks.prepare }))
const message = { version: 1 }
const wallet = (versions = new Set([1])) => ({
  signer: { address: 'recipient' },
  account: { address: 'recipient' },
  supportedTransactionVersions: versions,
})
function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((r) => {
    resolve = r
  })
  return { promise, resolve }
}
beforeEach(() => {
  vi.resetAllMocks()
  mocks.wallet = wallet()
  mocks.prepare.mockResolvedValue({ message })
  mocks.send.mockResolvedValue({ context: { signature: 'local-test-signature' } })
})
afterEach(cleanup)

test('prepares and submits only the exact prepared message, recording confirmation', async () => {
  const { result } = renderHook(useAirdropClaim)
  await act(async () => {
    await result.current.handleClaimAirdrop()
  })
  expect(mocks.send).toHaveBeenCalledWith(message, { abortSignal: expect.any(AbortSignal) })
  expect(result.current).toMatchObject({
    isLoading: false,
    signature: 'local-test-signature',
    status: 'Airdrop claim confirmed.',
  })
})
test.each([undefined, wallet(new Set([0]))])('blocks disconnected and V0-only wallets', async (value) => {
  mocks.wallet = value
  const { result } = renderHook(useAirdropClaim)
  expect(result.current.canClaim).toBe(false)
  await act(async () => {
    await result.current.handleClaimAirdrop()
  })
  expect(mocks.prepare).not.toHaveBeenCalled()
  expect(mocks.send).not.toHaveBeenCalled()
})
test('exposes RPC failure and permits retry without sending a failed preparation', async () => {
  mocks.prepare.mockRejectedValueOnce(new Error('RPC unavailable'))
  const { result } = renderHook(useAirdropClaim)
  await act(async () => {
    await result.current.handleClaimAirdrop()
  })
  expect(result.current.status).toBe('RPC unavailable')
  expect(result.current.isLoading).toBe(false)
  expect(mocks.send).not.toHaveBeenCalled()
  await act(async () => {
    await result.current.handleClaimAirdrop()
  })
  expect(mocks.send).toHaveBeenCalledOnce()
})
test('ignores duplicate clicks while preparing', async () => {
  const pending = deferred<{ message: typeof message }>()
  mocks.prepare.mockReturnValue(pending.promise)
  const { result } = renderHook(useAirdropClaim)
  let first!: Promise<void>
  act(() => {
    first = result.current.handleClaimAirdrop()
    void result.current.handleClaimAirdrop()
  })
  expect(result.current.isLoading).toBe(true)
  expect(mocks.prepare).toHaveBeenCalledOnce()
  await act(async () => {
    pending.resolve({ message })
    await first
  })
  expect(mocks.send).toHaveBeenCalledOnce()
})
test('signerchange at the same address aborts preparation and prevents stale submission', async () => {
  const pending = deferred<{ message: typeof message }>()
  mocks.prepare.mockReturnValueOnce(pending.promise)
  const { result, rerender } = renderHook(useAirdropClaim)
  let first!: Promise<void>
  act(() => {
    first = result.current.handleClaimAirdrop()
  })
  const signal = mocks.prepare.mock.calls[0][1] as AbortSignal
  mocks.wallet = wallet()
  rerender()
  expect(signal.aborted).toBe(true)
  await act(async () => {
    pending.resolve({ message })
    await first
  })
  expect(mocks.send).not.toHaveBeenCalled()
  expect(result.current).toMatchObject({ isLoading: false, status: '', signature: null })
})
test('ignores a late confirmation from a previous signer while a new claim is pending', async () => {
  const sent = deferred<{ context: { signature: string } }>()
  mocks.send.mockReturnValueOnce(sent.promise)
  const { result, rerender } = renderHook(useAirdropClaim)
  let first!: Promise<void>
  await act(async () => {
    first = result.current.handleClaimAirdrop()
    await Promise.resolve()
  })
  mocks.wallet = wallet()
  rerender()
  const pending = deferred<{ message: typeof message }>()
  mocks.prepare.mockReturnValueOnce(pending.promise)
  let second!: Promise<void>
  act(() => {
    second = result.current.handleClaimAirdrop()
  })
  await act(async () => {
    sent.resolve({ context: { signature: 'stale' } })
    await first
  })
  expect(result.current).toMatchObject({ isLoading: true, status: 'Preparing claim...', signature: null })
  await act(async () => {
    pending.resolve({ message })
    await second
  })
  expect(result.current.signature).toBe('local-test-signature')
})
test('unmount aborts pending preparation and never submits', async () => {
  const pending = deferred<{ message: typeof message }>()
  mocks.prepare.mockReturnValue(pending.promise)
  const { result, unmount } = renderHook(useAirdropClaim)
  let claim!: Promise<void>
  act(() => {
    claim = result.current.handleClaimAirdrop()
  })
  const signal = mocks.prepare.mock.calls[0][1] as AbortSignal
  unmount()
  expect(signal.aborted).toBe(true)
  await act(async () => {
    pending.resolve({ message })
    await claim
  })
  expect(mocks.send).not.toHaveBeenCalled()
})
