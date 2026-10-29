import { afterEach, beforeEach, expect, test, vi } from 'vitest'

const files = vi.hoisted(() => ({ exists: vi.fn(), read: vi.fn(), write: vi.fn() }))
vi.mock('fs', () => ({ existsSync: files.exists, readFileSync: files.read, writeFileSync: files.write }))
vi.mock('../anchor/lib/wallet-manager', () => ({ createGillWalletClient: vi.fn() }))
import { extractWallet } from '../anchor/scripts/extract-wallet'

const wallet = { name: 'example', keypairFile: 'example.json', secretKey: { array: [1, 2, 3] } }

beforeEach(() => {
  vi.clearAllMocks()
  files.exists.mockReturnValue(true)
  vi.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(() => vi.restoreAllMocks())

test.each(['address', 'publicKey'])('extracts a wallet stored with %s', (field) => {
  files.read.mockReturnValue(JSON.stringify({ wallets: [{ ...wallet, [field]: '11111111111111111111111111111112' }] }))
  expect(extractWallet('example', 'extracted.json')).toBe(true)
  expect(files.write).toHaveBeenCalledWith('extracted.json', JSON.stringify(wallet.secretKey.array, null, 2))
})

test('does not write a wallet file when its stored public address is missing', () => {
  files.read.mockReturnValue(JSON.stringify({ wallets: [wallet] }))
  expect(extractWallet('example', 'extracted.json')).toBe(false)
  expect(files.write).not.toHaveBeenCalled()
})
