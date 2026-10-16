import { beforeEach, describe, expect, it, vi } from 'vitest'
import { prepareWalletPayment } from '../src/lib/prepare-wallet-payment'
import type { AppClient } from '../src/lib/solana-client'
import type { HeadlessPaymentRequest } from '../src/hooks/use-headless-checkout'

vi.mock('../src/hooks/use-headless-checkout', () => ({ USDC_MINT: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU' }))
const payer = 'GsdTtXhTfT7ULg1wJwn5kVGUu42Lwe9J98huju9EzbbY'
const request = {
  recipient: 'AoK6fTbviCH1ZtQK6bzoy9u3UroLCxMtu5swxY8ro96W',
  splToken: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
  reference: '5Y4q3Tger1jW2ezQDgxy4wJMbSFEMfGyrAVTBrVNPJNM',
  amount: 1,
} as HeadlessPaymentRequest
const signer = { address: payer, modifyAndSignTransactions: vi.fn() }
let connected: unknown
let token: ReturnType<typeof vi.fn>
let balance: ReturnType<typeof vi.fn>
let account: ReturnType<typeof vi.fn>
let rent: ReturnType<typeof vi.fn>
let client: AppClient
describe('payment instruction preparation', () => {
  beforeEach(() => {
    connected = { signer, supportedTransactionVersions: new Set([1]) }
    token = vi.fn().mockResolvedValue({ value: { amount: '1000000', decimals: 6 } })
    balance = vi.fn().mockResolvedValue({ value: 10_000_000n })
    account = vi.fn().mockResolvedValue({ value: {} })
    rent = vi.fn().mockResolvedValue(2_039_280n)
    client = {
      wallet: { getState: () => ({ connected }) },
      rpc: {
        getTokenAccountBalance: () => ({ send: token }),
        getBalance: () => ({ send: balance }),
        getAccountInfo: (_address: unknown, config: { encoding: string }) => {
          expect(config.encoding).toBe('base64')
          return { send: account }
        },
        getMinimumBalanceForRentExemption: () => ({ send: rent }),
      },
    } as unknown as AppClient
  })
  it('builds ATA creation and exact checked transfer with checkout reference', async () => {
    const instructions = await prepareWalletPayment(client, request)
    expect(instructions).toHaveLength(2)
    expect(instructions[1].accounts.at(-1)?.address).toBe(request.reference)
    expect(instructions[1].data[0]).toBe(12)
    expect(new DataView(instructions[1].data.buffer, instructions[1].data.byteOffset).getBigUint64(1, true)).toBe(
      1_000_000n,
    )
    expect(instructions[1].data[9]).toBe(6)
    expect(rent).not.toHaveBeenCalled()
  })
  it('rejects wallets without V1 support', async () => {
    connected = { signer, supportedTransactionVersions: new Set([0]) }
    await expect(prepareWalletPayment(client, request)).rejects.toThrow('does not support V1')
    expect(token).not.toHaveBeenCalled()
  })
  it('rejects insufficient USDC', async () => {
    token.mockResolvedValue({ value: { amount: '999999', decimals: 6 } })
    await expect(prepareWalletPayment(client, request)).rejects.toThrow('Not enough USDC')
  })
  it('reports insufficient USDC when the payer has no token account', async () => {
    account.mockResolvedValueOnce({ value: null })
    await expect(prepareWalletPayment(client, request)).rejects.toThrow('Not enough USDC')
    expect(token).not.toHaveBeenCalled()
    expect(balance).not.toHaveBeenCalled()
  })
  it('preserves account lookup RPC errors instead of treating them as an empty wallet', async () => {
    const error = new Error('RPC unavailable')
    account.mockRejectedValueOnce(error)
    await expect(prepareWalletPayment(client, request)).rejects.toBe(error)
    expect(token).not.toHaveBeenCalled()
  })
  it('preserves token balance RPC errors instead of treating them as insufficient USDC', async () => {
    const error = new Error('Token balance RPC unavailable')
    token.mockRejectedValueOnce(error)
    await expect(prepareWalletPayment(client, request)).rejects.toBe(error)
  })
  it('includes rent when the merchant ATA does not exist', async () => {
    account.mockResolvedValueOnce({ value: {} }).mockResolvedValueOnce({ value: null })
    balance.mockResolvedValue({ value: 5000n })
    await expect(prepareWalletPayment(client, request)).rejects.toThrow('Not enough SOL')
    expect(rent).toHaveBeenCalled()
  })
  it('aborts when the account changes during preparation', async () => {
    token.mockImplementation(async () => {
      connected = null
      return { value: { amount: '1000000', decimals: 6 } }
    })
    await expect(prepareWalletPayment(client, request)).rejects.toThrow('Wallet changed')
  })
  it('rejects mismatched mints', async () => {
    await expect(prepareWalletPayment(client, { ...request, splToken: payer })).rejects.toThrow('mint')
  })
})
