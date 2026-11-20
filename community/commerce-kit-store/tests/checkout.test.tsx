// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  generate: vi.fn(),
  verify: vi.fn(),
  signatures: vi.fn(),
}))
vi.mock('@solana/react', () => ({ useClient: () => client }))
vi.mock('../src/components/wallet-ui', () => ({ WalletUI: () => null }))
vi.mock('../src/components/app-explorer-link', () => ({ AppExplorerLink: () => null }))
vi.mock('@solana/kit', () => ({
  address: (value: string) => value,
  generateKeyPair: async () => ({ publicKey: 'reference' }),
  getAddressFromPublicKey: async () => '11111111111111111111111111111114',
}))
vi.mock('@solana-commerce/headless', () => ({
  createBuyNowRequest: () => ({}),
  createCartRequest: () => ({}),
  createSolanaPayRequest: mocks.generate,
}))
vi.mock('../src/lib/verify-payment', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../src/lib/verify-payment')>()),
  verifyUsdcPayment: mocks.verify,
}))
const client = { rpc: { getSignaturesForAddress: () => ({ send: mocks.signatures }) } }
import { useHeadlessCheckout } from '../src/hooks/use-headless-checkout'
import { HeadlessCheckoutDialog } from '../src/components/checkout/headless-checkout-dialog'

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubEnv('NEXT_PUBLIC_MERCHANT_WALLET', '11111111111111111111111111111112')
  mocks.generate.mockResolvedValue({ url: new URL('https://example.com'), qr: '<svg />' })
  mocks.signatures.mockResolvedValue([])
  mocks.verify.mockResolvedValue({ verified: true })
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllEnvs()
})

test('confirms only after verification and calls success once', async () => {
  mocks.signatures.mockResolvedValue([{ signature: 'payment', err: null }])
  const onPaymentVerified = vi.fn()
  const onPaymentFound = vi.fn()
  const { result } = renderHook(() => useHeadlessCheckout({ onPaymentVerified, onPaymentFound }))
  await act(async () => {
    await result.current.openCheckout(9.99)
  })
  await waitFor(() => expect(result.current.status).toBe('confirmed'))
  expect(mocks.verify).toHaveBeenCalled()
  expect(onPaymentVerified).toHaveBeenCalledTimes(1)
  expect(onPaymentFound).toHaveBeenCalledTimes(1)
})

test('closing during verification suppresses the stale success callback', async () => {
  mocks.signatures.mockResolvedValue([{ signature: 'payment', err: null }])
  let finish!: (value: { verified: boolean }) => void
  mocks.verify.mockReturnValue(
    new Promise((resolve) => {
      finish = resolve
    }),
  )
  const onPaymentVerified = vi.fn()
  const { result } = renderHook(() => useHeadlessCheckout({ onPaymentVerified }))
  await act(async () => {
    await result.current.openCheckout(1)
  })
  await waitFor(() => expect(mocks.verify).toHaveBeenCalled())
  act(() => result.current.closeCheckout())
  await act(async () => finish({ verified: true }))
  expect(result.current.status).toBe('idle')
  expect(onPaymentVerified).not.toHaveBeenCalled()
})

test('closing during QR generation does not reopen a pending checkout', async () => {
  let finish!: (value: { url: URL; qr: string }) => void
  mocks.generate.mockReturnValue(
    new Promise((resolve) => {
      finish = resolve
    }),
  )
  const { result } = renderHook(() => useHeadlessCheckout())
  let opening!: Promise<void>
  act(() => {
    opening = result.current.openCheckout(1)
  })
  await waitFor(() => expect(mocks.generate).toHaveBeenCalled())
  act(() => result.current.closeCheckout())
  await act(async () => {
    finish({ url: new URL('https://example.com'), qr: '<svg />' })
    await opening
  })
  expect(result.current.status).toBe('idle')
  expect(result.current.paymentRequest).toBeNull()
})

test('RPC errors are shown instead of leaving checkout silently pending', async () => {
  mocks.signatures.mockRejectedValue(new Error('RPC unavailable'))
  const { result } = renderHook(() => useHeadlessCheckout())
  await act(async () => {
    await result.current.openCheckout(1)
  })
  await waitFor(() => expect(result.current.status).toBe('unavailable'))
  expect(result.current.error?.message).toBe('RPC unavailable')
  expect(result.current.paymentRequest).not.toBeNull()
  act(() => result.current.closeCheckout())
})

test('recovers the same reference after a temporary RPC failure', async () => {
  vi.useFakeTimers()
  mocks.signatures
    .mockRejectedValueOnce(new Error('RPC unavailable'))
    .mockResolvedValue([{ signature: 'payment', err: null }])
  const onPaymentVerified = vi.fn()
  const { result } = renderHook(() => useHeadlessCheckout({ onPaymentVerified }))
  await act(async () => {
    await result.current.openCheckout(1)
  })
  expect(result.current.error?.message).toBe('RPC unavailable')
  const reference = result.current.paymentRequest?.reference
  await act(async () => {
    await vi.advanceTimersByTimeAsync(3999)
  })
  expect(mocks.signatures).toHaveBeenCalledTimes(1)
  expect(result.current.status).toBe('unavailable')
  await act(async () => {
    await vi.advanceTimersByTimeAsync(1)
  })
  expect(result.current.status).toBe('confirmed')
  expect(mocks.signatures).toHaveBeenCalledTimes(2)
  expect(result.current.paymentRequest?.reference).toBe(reference)
  expect(result.current.error).toBeNull()
  expect(onPaymentVerified).toHaveBeenCalledTimes(1)
})

test('keeps the checkout visible through RPC trouble and confirms after retrying', async () => {
  vi.useFakeTimers()
  mocks.signatures
    .mockRejectedValueOnce(new Error('RPC unavailable'))
    .mockResolvedValue([{ signature: 'payment', err: null }])
  mocks.generate.mockResolvedValue({
    url: new URL('https://example.com'),
    qr: '<svg aria-label="Payment QR code"></svg>',
  })
  const onPaymentVerified = vi.fn()
  function Checkout() {
    const checkout = useHeadlessCheckout({ onPaymentVerified })
    return (
      <>
        <button onClick={() => void checkout.openCheckout(1)}>Open checkout</button>
        <HeadlessCheckoutDialog
          {...checkout}
          onClose={checkout.closeCheckout}
          walletPayment={{
            busy: false,
            submitted: false,
            error: null,
            supportsV1: true,
            walletName: undefined,
            pay: vi.fn(),
          }}
        />
      </>
    )
  }
  render(<Checkout />)
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Open checkout' }))
  })
  expect(screen.getByRole('alert').textContent).toContain('Retrying automatically')
  expect(screen.queryByText('Payment Failed')).toBeNull()
  expect(screen.getByLabelText('Payment QR code')).toBeTruthy()
  expect(screen.getByText('11111111111111111111111111111114')).toBeTruthy()
  expect(screen.getByText('Connection issue')).toBeTruthy()
  expect(screen.queryByText('Verifying transaction...')).toBeNull()
  await act(async () => {
    await vi.advanceTimersByTimeAsync(4000)
  })
  expect(screen.getByText('Payment Confirmed!')).toBeTruthy()
  expect(screen.queryByRole('alert')).toBeNull()
  expect(mocks.generate).toHaveBeenCalledTimes(1)
  expect(onPaymentVerified).toHaveBeenCalledTimes(1)
})

test('failed candidates cannot confirm a payment', async () => {
  mocks.signatures.mockResolvedValue([{ signature: 'failed', err: { code: 1 } }])
  const onPaymentFound = vi.fn()
  const { result } = renderHook(() => useHeadlessCheckout({ onPaymentFound }))
  await act(async () => {
    await result.current.openCheckout(1)
  })
  await waitFor(() => expect(mocks.signatures).toHaveBeenCalled())
  expect(mocks.verify).not.toHaveBeenCalled()
  expect(onPaymentFound).not.toHaveBeenCalled()
  act(() => result.current.closeCheckout())
})
