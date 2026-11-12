import { expect, test } from 'vitest'
import { validateAirdrop, formatTokenAmount } from '../src/features/airdrop/data-access/airdrop-utils'
import { makeAccount } from './wallet-fixture'

const mint = makeAccount(4).address
const recipient = makeAccount(3).address
const config = {
  mintAddress: mint,
  authority: makeAccount(1).address,
  decimals: 9,
  name: 'Test',
  symbol: 'T',
  network: 'http://localhost:8899',
}
const data = {
  mint,
  decimals: 9,
  totalRecipients: 1,
  totalAmount: '18446744073709551615',
  recipients: [{ recipient, amount: '18446744073709551615', index: 0 }],
  generatedAt: 'test',
}

test('preserves exact u64 token amounts', () => {
  expect(validateAirdrop(config, data, 1).amounts).toEqual([18446744073709551615n])
  expect(formatTokenAmount(data.totalAmount, 9)).toBe('18,446,744,073.709551615')
  expect(formatTokenAmount('10', 0)).toBe('10')
})
test.each(['0', '-1', '1.5', '18446744073709551616', '1e9'])(
  'rejects invalid amount %s before RPC or signing',
  (amount) => {
    expect(() => validateAirdrop(config, { ...data, recipients: [{ recipient, amount, index: 0 }] }, 1)).toThrow()
  },
)
test.each([0, -1, 6, 1.5, NaN])('rejects unsafe batch size %s', (size) => {
  expect(() => validateAirdrop(config, data, size)).toThrow('Batch size')
})
test('rejects mismatched setup, duplicate recipients and incorrect totals', () => {
  expect(() => validateAirdrop({ ...config, decimals: 8 }, data, 1)).toThrow('decimals')
  expect(() => validateAirdrop(config, { ...data, totalAmount: '1' }, 1)).toThrow('Total amount')
  expect(() =>
    validateAirdrop(config, { ...data, totalRecipients: 2, recipients: [data.recipients[0], data.recipients[0]] }, 1),
  ).toThrow('Duplicate')
})
