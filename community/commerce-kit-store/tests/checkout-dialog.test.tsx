// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ComponentProps, ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({
  busy: false,
  submitted: false,
  onOpenChange: null as null | ((open: boolean) => void),
}))
vi.mock('../src/hooks/use-wallet-payment', () => ({
  useWalletPayment: () => ({ ...state, error: null, pay: vi.fn() }),
}))
vi.mock('../src/components/wallet-ui', () => ({ WalletUI: () => null }))
vi.mock('../src/components/app-explorer-link', () => ({ AppExplorerLink: () => null }))
vi.mock('../src/components/ui/dialog', () => {
  const Wrapper = ({ children }: { children: ReactNode }) => <div>{children}</div>
  return {
    Dialog: ({ children, onOpenChange }: { children: ReactNode; onOpenChange: (open: boolean) => void }) => {
      state.onOpenChange = onOpenChange
      return <div>{children}</div>
    },
    DialogContent: Wrapper,
    DialogHeader: Wrapper,
    DialogTitle: Wrapper,
    DialogDescription: Wrapper,
  }
})
import { HeadlessCheckoutDialog } from '../src/components/checkout/headless-checkout-dialog'

beforeEach(() => {
  state.busy = false
  state.submitted = false
  state.onOpenChange = null
})
afterEach(cleanup)

function setup(overrides: Partial<ComponentProps<typeof HeadlessCheckoutDialog>> = {}) {
  const onClose = vi.fn()
  render(
    <HeadlessCheckoutDialog
      isOpen
      onClose={onClose}
      amount={1}
      status="pending"
      paymentRequest={null}
      signature={null}
      error={null}
      verificationResult={null}
      {...overrides}
    />,
  )
  return onClose
}

describe('payment-safe checkout dismissal', () => {
  it('allows cancelling before sending', () => {
    const close = setup()
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(close).toHaveBeenCalledOnce()
  })
  it.each(['busy', 'submitted'] as const)('blocks dismissal while %s', (field) => {
    state[field] = true
    const close = setup()
    expect((screen.getByRole('button', { name: 'Cancel' }) as HTMLButtonElement).disabled).toBe(true)
    act(() => state.onOpenChange?.(false))
    expect(close).not.toHaveBeenCalled()
  })
  it('does not bypass the guard through the verification error screen', () => {
    state.submitted = true
    const close = setup({ error: new Error('RPC temporarily unavailable'), status: 'verifying' })
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    act(() => state.onOpenChange?.(false))
    expect(close).not.toHaveBeenCalled()
  })
  it('allows dismissal once the payment is confirmed', () => {
    state.submitted = true
    const close = setup({ status: 'confirmed', signature: 'confirmed-signature' })
    fireEvent.click(screen.getByRole('button', { name: 'Done' }))
    expect(close).toHaveBeenCalledOnce()
  })
})
