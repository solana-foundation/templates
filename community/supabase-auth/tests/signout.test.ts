import { beforeEach, expect, test, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
const mocks = vi.hoisted(() => ({ signOut: vi.fn(), disconnect: vi.fn() }))
vi.mock('@/components/auth/auth-provider', () => ({ useAuth: () => ({ signOut: mocks.signOut }) }))
vi.mock('@/components/provider', () => ({ useSolana: () => ({ client: {} }) }))
vi.mock('@solana/kit-plugin-wallet/react', () => ({ useDisconnect: () => ({ dispatchAsync: mocks.disconnect }) }))
import { useCombinedSignOut } from '../src/hooks/use-combined-signout'

beforeEach(() => {
  mocks.signOut.mockReset().mockResolvedValue(undefined)
  mocks.disconnect.mockReset().mockResolvedValue(undefined)
})

test('signs out and disconnects once on success', async () => {
  const { result } = renderHook(() => useCombinedSignOut())
  await expect(result.current.handleSignOut()).resolves.toBeUndefined()
  expect(mocks.signOut).toHaveBeenCalledTimes(1)
  expect(mocks.disconnect).toHaveBeenCalledTimes(1)
})

test('reports auth logout failure while still disconnecting the wallet', async () => {
  mocks.signOut.mockRejectedValue(new Error('Auth service unreachable'))
  const { result } = renderHook(() => useCombinedSignOut())
  await expect(result.current.handleSignOut()).rejects.toThrow('Auth service unreachable')
  expect(mocks.disconnect).toHaveBeenCalledTimes(1)
})

test('reports wallet disconnect failure without retrying it silently', async () => {
  mocks.disconnect.mockRejectedValue(new Error('Wallet unavailable'))
  const { result } = renderHook(() => useCombinedSignOut())
  await expect(result.current.handleSignOut()).rejects.toThrow('Wallet unavailable')
  expect(mocks.disconnect).toHaveBeenCalledTimes(1)
})

test('preserves both errors when logout and disconnect fail', async () => {
  const authError = new Error('Auth service unreachable')
  const walletError = new Error('Wallet unavailable')
  mocks.signOut.mockRejectedValue(authError)
  mocks.disconnect.mockRejectedValue(walletError)
  const { result } = renderHook(() => useCombinedSignOut())
  await expect(result.current.handleSignOut()).rejects.toMatchObject({ errors: [authError, walletError] })
})
