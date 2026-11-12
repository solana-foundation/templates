// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  address,
  createFailedToSendTransactionError,
  createTransactionMessage,
  failedSingleTransactionPlanResult,
  setTransactionMessageFeePayer,
} from '@solana/kit'
import type { CartItem } from '../src/store/types/cart'

const mocks = vi.hoisted(() => ({
  prepare: vi.fn(),
  send: vi.fn(),
  signatures: vi.fn(),
  statuses: vi.fn(),
  verify: vi.fn(),
}))
vi.mock('@solana/react', () => ({ useClient: () => client }))
vi.mock('@solana/kit', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@solana/kit')>()),
  generateKeyPair: async () => ({ publicKey: 'reference' }),
  getAddressFromPublicKey: async () => '11111111111111111111111111111114',
}))
vi.mock('@solana/kit-plugin-wallet/react', () => ({
  useConnectedWallet: () => ({ wallet: { name: 'Test Wallet' }, supportedTransactionVersions: new Set([1]) }),
}))
vi.mock('../src/lib/prepare-wallet-payment', () => ({ prepareWalletPayment: mocks.prepare }))
vi.mock('../src/lib/verify-payment', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../src/lib/verify-payment')>()),
  verifyUsdcPayment: mocks.verify,
}))
vi.mock('@solana-commerce/headless', () => ({
  createCartRequest: () => ({}),
  createBuyNowRequest: () => ({}),
  createSolanaPayRequest: async () => ({ url: new URL('https://example.com'), qr: '<svg />' }),
}))
vi.mock('../src/components/wallet-ui', () => ({ WalletUI: () => null }))
vi.mock('../src/components/app-explorer-link', () => ({ AppExplorerLink: () => null }))
vi.mock('next/image', () => ({ default: () => null }))
vi.mock('sonner', () => ({ toast: { success: vi.fn() } }))
vi.mock('../src/components/ui/sheet', () => {
  const Wrapper = ({ children }: { children: ReactNode }) => <div>{children}</div>
  return {
    Sheet: ({ open, children }: { open: boolean; children: ReactNode }) => (open ? <div>{children}</div> : null),
    SheetContent: Wrapper,
    SheetHeader: Wrapper,
    SheetTitle: Wrapper,
  }
})

const client = {
  sendTransaction: mocks.send,
  rpc: {
    getSignaturesForAddress: () => ({ send: mocks.signatures }),
    getBlockHeight: () => ({ send: async () => 99n }),
    getSignatureStatuses: () => ({ send: mocks.statuses }),
  },
}
import { CartDrawer } from '../src/store/components/cart-drawer'
import { CartProvider } from '../src/store/providers/cart-provider'

const item: CartItem = {
  product: {
    id: 'shirt',
    name: 'Test Shirt',
    description: 'Test product',
    basePrice: 30,
    imageUrl: '/shirt.png',
    images: {},
    variations: [],
  },
  variationId: 'shirt-m-black',
  color: 'black',
  size: 'M',
  quantity: 1,
  price: 30,
}
const storageKey = 'solana-pay-store-cart'

function changeCartInAnotherTab(items: CartItem[]) {
  const newValue = JSON.stringify(items)
  localStorage.setItem(storageKey, newValue)
  act(() => window.dispatchEvent(new StorageEvent('storage', { key: storageKey, newValue })))
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubEnv('NEXT_PUBLIC_MERCHANT_WALLET', '11111111111111111111111111111112')
  mocks.prepare.mockResolvedValue([])
  mocks.send.mockResolvedValue({})
  mocks.statuses.mockReturnValue(new Promise(() => {}))
  mocks.verify.mockResolvedValue({ verified: true })
})
afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.unstubAllEnvs()
})

describe('cart changes during an active payment', () => {
  it.each(['preparing', 'sending', 'submitted', 'uncertain'] as const)(
    'preserves tracking and prevents another payment while %s',
    async (phase) => {
      let finishPreparation!: (value: never[]) => void
      let finishSending!: (value: object) => void
      let confirmPayment!: (value: { signature: string; err: null }[]) => void
      mocks.signatures.mockImplementation(
        () =>
          new Promise((resolve) => {
            confirmPayment = resolve
          }),
      )
      if (phase === 'preparing') {
        mocks.prepare.mockReturnValue(
          new Promise((resolve) => {
            finishPreparation = resolve
          }),
        )
      }
      if (phase === 'sending') {
        mocks.send.mockReturnValue(
          new Promise((resolve) => {
            finishSending = resolve
          }),
        )
      }
      if (phase === 'uncertain') {
        const message = setTransactionMessageFeePayer(
          address('11111111111111111111111111111111'),
          createTransactionMessage({ version: 1 }),
        )
        mocks.send.mockRejectedValue(
          createFailedToSendTransactionError(
            failedSingleTransactionPlanResult(message, new Error('Confirmation timed out'), {
              signature: '1'.repeat(64),
              transaction: { lifetimeConstraint: { lastValidBlockHeight: 100n } },
            }),
          ),
        )
      }

      const onClose = vi.fn()
      const view = render(
        <CartProvider>
          <CartDrawer isOpen onClose={onClose} />
        </CartProvider>,
      )
      changeCartInAnotherTab([item])
      fireEvent.click(screen.getByRole('button', { name: 'Pay with USDC' }))
      const pay = await screen.findByRole('button', { name: 'Pay with connected wallet' })
      fireEvent.click(pay)
      await waitFor(() => expect(mocks.prepare).toHaveBeenCalledOnce())
      if (phase === 'submitted') await screen.findByText('Waiting for payment verification...')
      if (phase === 'uncertain') await screen.findByText(/Payment outcome is not yet known/)

      changeCartInAnotherTab([])
      expect(screen.getByRole('button', { name: /Confirming payment|Waiting for payment verification/ })).toBeTruthy()
      expect((screen.getByRole('button', { name: 'Cancel' }) as HTMLButtonElement).disabled).toBe(true)
      expect(screen.getByText('11111111111111111111111111111114')).toBeTruthy()
      expect(screen.getByText('Test Shirt x1')).toBeTruthy()

      // Closing the sheet must not unmount the independent payment dialog or its owner.
      view.rerender(
        <CartProvider>
          <CartDrawer isOpen={false} onClose={onClose} />
        </CartProvider>,
      )
      expect(screen.getByText('Payment reference')).toBeTruthy()
      changeCartInAnotherTab([item])
      view.rerender(
        <CartProvider>
          <CartDrawer isOpen onClose={onClose} />
        </CartProvider>,
      )
      const lockedPay = screen.getByRole('button', { name: /Confirming payment|Waiting for payment verification/ })
      expect((lockedPay as HTMLButtonElement).disabled).toBe(true)
      expect((screen.getByRole('button', { name: 'Pay with USDC', hidden: true }) as HTMLButtonElement).disabled).toBe(
        true,
      )
      fireEvent.click(lockedPay)
      expect(mocks.prepare).toHaveBeenCalledOnce()

      await act(async () => {
        if (phase === 'preparing') finishPreparation([])
        if (phase === 'sending') finishSending({})
      })
      await waitFor(() => expect(mocks.send).toHaveBeenCalledOnce())
      if (phase === 'uncertain') expect(mocks.statuses).toHaveBeenCalledOnce()
      await act(async () => confirmPayment([{ signature: 'verified-payment', err: null }]))
      await screen.findByText('Payment Confirmed!')
      expect(mocks.verify).toHaveBeenCalledOnce()
      expect((screen.getByRole('button', { name: 'Done' }) as HTMLButtonElement).disabled).toBe(false)
    },
  )
})
