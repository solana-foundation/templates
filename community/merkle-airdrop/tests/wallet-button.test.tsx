// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { WalletButton } from '../src/components/wallet-button'

const mock = vi.hoisted(() => ({
  wallets: [] as unknown[],
  connected: null as unknown,
  connect: vi.fn(),
  disconnect: vi.fn(),
  resetConnect: vi.fn(),
  resetDisconnect: vi.fn(),
  copy: vi.fn(),
}))
vi.mock('@solana/react', () => ({ useClient: () => ({}) }))
vi.mock('@solana/kit-plugin-wallet/react', () => ({
  useWallets: () => mock.wallets,
  useConnectedWallet: () => mock.connected,
  useConnect: () => ({ dispatchAsync: mock.connect, reset: mock.resetConnect, isRunning: false }),
  useDisconnect: () => ({ dispatchAsync: mock.disconnect, reset: mock.resetDisconnect, isRunning: false }),
}))
vi.mock('@wallet-standard/ui-registry', () => ({ getWalletForHandle: (wallet: unknown) => wallet }))
vi.mock('next/image', () => ({ default: () => null }))
const a = { name: 'Same wallet', icon: 'data:image/png;base64,', id: 'a' }
const b = { name: 'Same wallet', icon: 'data:image/png;base64,', id: 'b' }
beforeEach(() => {
  vi.resetAllMocks()
  mock.wallets = [a, b]
  mock.connected = null
  mock.connect.mockResolvedValue(undefined)
  mock.disconnect.mockResolvedValue(undefined)
  mock.copy.mockResolvedValue(undefined)
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: mock.copy } })
})
afterEach(cleanup)

test('marks only the selected wallet active when names match', () => {
  mock.connected = { wallet: a, account: { address: '11111111111111111111111111111112' } }
  render(<WalletButton />)
  fireEvent.click(screen.getByRole('button'))
  expect(screen.getAllByRole('button', { name: 'Same wallet (Active)' })).toHaveLength(1)
  expect(screen.getAllByRole('button', { name: 'Same wallet', exact: true })).toHaveLength(1)
})

test('connects the selected identity and closes the menu', async () => {
  render(<WalletButton />)
  fireEvent.click(screen.getByRole('button', { name: 'Select Wallet' }))
  await act(async () => {
    fireEvent.click(screen.getAllByRole('button', { name: 'Same wallet', exact: true })[1])
  })
  expect(mock.connect).toHaveBeenCalledWith(b)
  expect(mock.resetDisconnect).toHaveBeenCalled()
  expect(screen.queryByRole('button', { name: 'Same wallet' })).toBeNull()
})

test('copies the current address without requesting a signature', async () => {
  mock.connected = { wallet: a, account: { address: '11111111111111111111111111111112' } }
  render(<WalletButton />)
  fireEvent.click(screen.getByRole('button'))
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Copy address' }))
  })
  expect(mock.copy).toHaveBeenCalledWith('11111111111111111111111111111112')
  expect(mock.connect).not.toHaveBeenCalled()
})

test('disconnects and resets stale errors', async () => {
  mock.connected = { wallet: a, account: { address: '11111111111111111111111111111112' } }
  render(<WalletButton />)
  fireEvent.click(screen.getByRole('button'))
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Disconnect', exact: true }))
  })
  expect(mock.disconnect).toHaveBeenCalledOnce()
  expect(mock.resetConnect).toHaveBeenCalled()
})

test('closes on outside click and Escape', () => {
  render(<WalletButton />)
  fireEvent.click(screen.getByRole('button', { name: 'Select Wallet' }))
  fireEvent.mouseDown(document.body)
  expect(screen.queryByRole('button', { name: 'Same wallet' })).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Select Wallet' }))
  fireEvent.keyDown(document, { key: 'Escape' })
  expect(screen.queryByRole('button', { name: 'Same wallet' })).toBeNull()
})

test('shows a recoverable clipboard error', async () => {
  mock.connected = { wallet: a, account: { address: '11111111111111111111111111111112' } }
  mock.copy.mockRejectedValue(new Error('clipboard unavailable'))
  render(<WalletButton />)
  fireEvent.click(screen.getByRole('button'))
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Copy address' }))
  })
  expect(screen.getByRole('alert').textContent).toContain('Could not copy')
})
