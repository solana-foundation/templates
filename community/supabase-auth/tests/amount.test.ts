import { expect, test } from 'vitest'
import { parseSol, formatSol } from '../src/lib/sol-amount'

test.each([
  ['0.000000001', 1n],
  ['0.001', 1_000_000n],
  ['1', 1_000_000_000n],
  ['18446744073.709551615', (1n << 64n) - 1n],
])('parses and formats %s exactly', (text, value) => {
  expect(parseSol(text)).toBe(value)
  expect(formatSol(value)).toBe(text)
})
test.each(['', '0', '-1', 'NaN', 'Infinity', '1e3', '.1', '1.0000000001', '18446744073.709551616'])(
  'rejects %s',
  (text) => {
    expect(() => parseSol(text)).toThrow()
  },
)
test('preserves precision above Number.MAX_SAFE_INTEGER', () => {
  expect(formatSol(9_007_199_254_740_993n)).toBe('9007199.254740993')
})
