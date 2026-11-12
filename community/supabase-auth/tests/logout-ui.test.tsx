import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
const mocks = vi.hoisted(() => ({
  signOut: vi.fn(),
  disconnect: vi.fn(),
  replace: vi.fn(),
  toast: vi.fn(),
}))
vi.mock('@/components/auth/auth-provider', () => ({
  useAuth: () => ({ user: { id: 'test-user' }, signOut: mocks.signOut }),
}))
vi.mock('@/components/provider', () => ({ useSolana: () => ({ client: {} }) }))
vi.mock('@/lib/supabase', () => ({ supabase: { auth: {} } }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: mocks.replace, push: vi.fn() }) }))
vi.mock('sonner', () => ({ toast: { error: mocks.toast } }))
vi.mock('@solana/kit-plugin-wallet/react', () => ({
  useConnectedWallet: () => ({ account: { address: 'TestWalletAddress' } }),
  useDisconnect: () => ({ dispatchAsync: mocks.disconnect }),
}))
import WalletLogin from '../src/components/auth/wallet-login'
import { WalletDisconnect } from '../src/components/wallet-disconnect'

beforeEach(() => {
  mocks.signOut.mockReset().mockRejectedValue(new Error('Auth service unreachable'))
  mocks.disconnect.mockReset().mockResolvedValue(undefined)
  mocks.replace.mockReset()
  mocks.toast.mockReset()
})
afterEach(cleanup)

test('login panel displays failed logout and lets the user retry', async () => {
  render(<WalletLogin />)
  fireEvent.click(screen.getByRole('button', { name: 'Sign Out' }))
  expect(await screen.findByRole('status')).toHaveProperty('textContent', 'Sign out failed: Auth service unreachable')
  expect(screen.getByRole('button', { name: 'Sign Out' })).toHaveProperty('disabled', false)
  expect(mocks.disconnect).toHaveBeenCalledTimes(1)
})

test('disconnect reports failure without redirecting as if logout succeeded', async () => {
  render(<WalletDisconnect />)
  fireEvent.click(screen.getByRole('button', { name: 'Disconnect' }))
  await waitFor(() => expect(mocks.toast).toHaveBeenCalledWith('Sign out failed: Auth service unreachable'))
  expect(mocks.replace).not.toHaveBeenCalled()
  expect(screen.getByRole('button', { name: 'Disconnect' })).toHaveProperty('disabled', false)
})

test('prevents duplicate logout requests and recovers after rejection', async () => {
  let reject!: (error: Error) => void
  mocks.signOut.mockImplementation(
    () =>
      new Promise<void>((_resolve, rejectPromise) => {
        reject = rejectPromise
      }),
  )
  render(<WalletLogin />)
  const button = screen.getByRole('button', { name: 'Sign Out' })
  fireEvent.click(button)
  fireEvent.click(button)
  expect(button).toHaveProperty('disabled', true)
  expect(mocks.signOut).toHaveBeenCalledTimes(1)
  reject(new Error('Auth service unreachable'))
  expect(await screen.findByRole('status')).toHaveProperty('textContent', 'Sign out failed: Auth service unreachable')
  expect(screen.getByRole('button', { name: 'Sign Out' })).toHaveProperty('disabled', false)
})
