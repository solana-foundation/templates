const U64_MAX = (1n << 64n) - 1n

export function parseSol(value: string): bigint {
  if (!/^\d+(\.\d{1,9})?$/.test(value)) throw new Error('Enter a positive SOL amount with at most 9 decimals.')
  const [whole, fraction = ''] = value.split('.')
  const amount = BigInt(whole) * 1_000_000_000n + BigInt(fraction.padEnd(9, '0'))
  if (amount <= 0n || amount > U64_MAX) throw new Error('SOL amount is outside the supported range.')
  return amount
}

export function formatSol(value: bigint): string {
  const fraction = (value % 1_000_000_000n).toString().padStart(9, '0').replace(/0+$/, '')
  return `${value / 1_000_000_000n}${fraction ? `.${fraction}` : ''}`
}
