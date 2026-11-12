// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { hydrateRoot } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  wallet: null as null | { account: { address: string } },
  disconnect: vi.fn(),
}))
vi.mock('@solana/react', () => ({ useClient: () => ({}) }))
vi.mock('@solana/kit-plugin-wallet/react', () => ({
  useConnect: () => ({ dispatchAsync: vi.fn(), isRunning: false }),
  useDisconnect: () => ({ dispatchAsync: mocks.disconnect, isRunning: false }),
  useConnectedWallet: () => mocks.wallet,
  useIsWalletReady: () => true,
  useWallets: () => [],
}))
import { WalletUI } from '../src/components/wallet-ui'

beforeEach(() => {
  mocks.wallet = null
  vi.clearAllMocks()
})
afterEach(cleanup)

test('hydrates wallet readiness without a server/client mismatch', async () => {
  const container = document.createElement('div')
  container.innerHTML = renderToString(<WalletUI />)
  expect(container.textContent).toContain('restoring wallet...')
  document.body.appendChild(container)
  const onRecoverableError = vi.fn()
  let root!: ReturnType<typeof hydrateRoot>
  await act(async () => {
    root = hydrateRoot(container, <WalletUI />, { onRecoverableError })
  })
  expect(container.textContent).toContain('connect wallet')
  expect(onRecoverableError).not.toHaveBeenCalled()
  act(() => root.unmount())
  container.remove()
})

test('connected account label follows wallet updates', () => {
  mocks.wallet = { account: { address: '11111111111111111111111111111112' } }
  const { rerender } = render(<WalletUI />)
  expect(screen.getByRole('button').textContent).toContain('1112')
  mocks.wallet = { account: { address: '11111111111111111111111111111113' } }
  rerender(<WalletUI />)
  expect(screen.getByRole('button').textContent).toContain('1113')
})

test('disconnect errors are displayed and handled', async () => {
  mocks.wallet = { account: { address: '11111111111111111111111111111112' } }
  mocks.disconnect.mockRejectedValueOnce(new Error('Disconnect failed'))
  render(<WalletUI />)
  fireEvent.click(screen.getByRole('button'))
  fireEvent.click(screen.getByRole('button', { name: /^disconnect$/ }))
  await waitFor(() => expect(screen.getByRole('alert').textContent).toBe('Disconnect failed'))
})
