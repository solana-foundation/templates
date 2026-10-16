// @vitest-environment jsdom
import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useWalletPayment } from '../src/hooks/use-wallet-payment'
import type { HeadlessPaymentRequest } from '../src/hooks/use-headless-checkout'
import {
  address,
  createFailedToSendTransactionError,
  createTransactionMessage,
  failedSingleTransactionPlanResult,
  setTransactionMessageFeePayer,
} from '@solana/kit'

const mocks = vi.hoisted(() => ({ prepare: vi.fn(), send: vi.fn(), height: vi.fn(), statuses: vi.fn() }))
vi.mock('@solana/react', () => ({ useClient: () => client }))
const client = {
  sendTransaction: mocks.send,
  rpc: {
    getBlockHeight: () => ({ send: mocks.height }),
    getSignatureStatuses: () => ({ send: mocks.statuses }),
  },
}
vi.mock('../src/lib/prepare-wallet-payment', () => ({ prepareWalletPayment: mocks.prepare }))
const request = { reference: 'reference', amount: 1 } as HeadlessPaymentRequest
function sendFailure(sent: boolean) {
  const message = setTransactionMessageFeePayer(
    address('11111111111111111111111111111111'),
    createTransactionMessage({ version: 1 }),
  )
  const context = sent
    ? { signature: '1'.repeat(64), transaction: { lifetimeConstraint: { lastValidBlockHeight: 100n } } }
    : {}
  return createFailedToSendTransactionError(
    failedSingleTransactionPlanResult(message, new Error('Simulation or send failed'), context),
  )
}
describe('connected wallet payment', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.prepare.mockResolvedValue([])
    mocks.send.mockResolvedValue({})
    mocks.height.mockResolvedValue(99n)
    mocks.statuses.mockResolvedValue({ value: [null] })
  })
  it('prepares, sends once and prevents repeated payment', async () => {
    const { result } = renderHook(() => useWalletPayment(request, false))
    await act(async () => {
      await result.current.pay()
    })
    await act(async () => {
      await result.current.pay()
    })
    expect(mocks.send).toHaveBeenCalledTimes(1)
    expect(result.current.submitted).toBe(true)
  })
  it('blocks simultaneous clicks while preparing', async () => {
    let finish!: (v: never[]) => void
    mocks.prepare.mockReturnValue(
      new Promise((resolve) => {
        finish = resolve
      }),
    )
    const { result } = renderHook(() => useWalletPayment(request, false))
    let pending!: Promise<void>
    act(() => {
      pending = result.current.pay()
      void result.current.pay()
    })
    await act(async () => {
      finish([])
      await pending
    })
    expect(mocks.send).toHaveBeenCalledTimes(1)
  })
  it('allows retry after explicit wallet rejection', async () => {
    mocks.send.mockRejectedValueOnce(new Error('User rejected the request'))
    const { result } = renderHook(() => useWalletPayment(request, false))
    await act(async () => {
      await result.current.pay()
    })
    expect(result.current.submitted).toBe(false)
    expect(result.current.error).toContain('rejected')
    await act(async () => {
      await result.current.pay()
    })
    expect(mocks.send).toHaveBeenCalledTimes(2)
  })
  it('blocks another payment after ambiguous send failure', async () => {
    mocks.send.mockRejectedValue(new Error('Network timeout'))
    const { result } = renderHook(() => useWalletPayment(request, false))
    await act(async () => {
      await result.current.pay()
    })
    await act(async () => {
      await result.current.pay()
    })
    expect(mocks.send).toHaveBeenCalledTimes(1)
    expect(result.current.error).toContain('Do not pay again')
  })
  it('allows retry after the SDK proves failure before signing or sending', async () => {
    mocks.send.mockRejectedValueOnce(sendFailure(false))
    const { result } = renderHook(() => useWalletPayment(request, false))
    await act(async () => {
      await result.current.pay()
    })
    expect(result.current.submitted).toBe(false)
    await act(async () => {
      await result.current.pay()
    })
    expect(mocks.send).toHaveBeenCalledTimes(2)
  })
  it('keeps a signed but unconfirmed transaction locked while its blockhash is valid', async () => {
    mocks.send.mockRejectedValueOnce(sendFailure(true))
    const { result, unmount } = renderHook(() => useWalletPayment(request, false))
    await act(async () => {
      await result.current.pay()
    })
    expect(result.current.submitted).toBe(true)
    await act(async () => {
      await result.current.pay()
    })
    expect(mocks.send).toHaveBeenCalledTimes(1)
    unmount()
  })
  it('releases a transaction proven absent after finalized blockhash expiry', async () => {
    mocks.send.mockRejectedValueOnce(sendFailure(true))
    mocks.height.mockResolvedValue(101n)
    const { result } = renderHook(() => useWalletPayment(request, false))
    await act(async () => {
      await result.current.pay()
    })
    await waitFor(() => expect(result.current.submitted).toBe(false))
    expect(result.current.error).toContain('expired')
    expect(mocks.height.mock.invocationCallOrder[0]).toBeLessThan(mocks.statuses.mock.invocationCallOrder[0])
  })
  it('releases a finalized failed transaction', async () => {
    mocks.send.mockRejectedValueOnce(sendFailure(true))
    mocks.statuses.mockResolvedValue({
      value: [{ confirmationStatus: 'finalized', err: { InstructionError: [0, 'error'] } }],
    })
    const { result } = renderHook(() => useWalletPayment(request, false))
    await act(async () => {
      await result.current.pay()
    })
    await waitFor(() => expect(result.current.submitted).toBe(false))
    expect(result.current.error).toContain('transaction failed')
  })
  it('does not release an uncertain payment while the RPC is unavailable', async () => {
    mocks.send.mockRejectedValueOnce(sendFailure(true))
    mocks.height.mockRejectedValue(new Error('RPC unavailable'))
    const { result, unmount } = renderHook(() => useWalletPayment(request, false))
    await act(async () => {
      await result.current.pay()
    })
    expect(result.current.submitted).toBe(true)
    expect(result.current.error).toContain('not yet known')
    unmount()
  })
  it('does not release a landed payment just because its blockhash expired', async () => {
    mocks.send.mockRejectedValueOnce(sendFailure(true))
    mocks.height.mockResolvedValue(101n)
    mocks.statuses.mockResolvedValue({ value: [{ confirmationStatus: 'confirmed', err: null }] })
    const { result, unmount } = renderHook(() => useWalletPayment(request, false))
    await act(async () => {
      await result.current.pay()
    })
    expect(result.current.submitted).toBe(true)
    unmount()
  })
  it('does not send when preparation fails', async () => {
    mocks.prepare.mockRejectedValue(new Error('Not enough USDC'))
    const { result } = renderHook(() => useWalletPayment(request, false))
    await act(async () => {
      await result.current.pay()
    })
    expect(mocks.send).not.toHaveBeenCalled()
    expect(result.current.error).toContain('Not enough USDC')
  })
  it('cancels when checkout confirms during preparation', async () => {
    let finish!: (v: never[]) => void
    mocks.prepare.mockReturnValue(
      new Promise((resolve) => {
        finish = resolve
      }),
    )
    const { result, rerender } = renderHook(({ confirmed }) => useWalletPayment(request, confirmed), {
      initialProps: { confirmed: false },
    })
    let pending!: Promise<void>
    act(() => {
      pending = result.current.pay()
    })
    rerender({ confirmed: true })
    await act(async () => {
      finish([])
      await pending
    })
    expect(mocks.send).not.toHaveBeenCalled()
    await waitFor(() => expect(result.current.busy).toBe(false))
  })
})
