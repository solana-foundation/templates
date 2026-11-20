import { describe, expect, it } from 'vitest'
import { lamportsToSol } from '@/utils/lamports-to-sol'

describe('lamportsToSol', () => {
  it('converts lamports to SOL', () => {
    expect(lamportsToSol(1_000_000_000n)).toBe(1)
    expect(lamportsToSol(1_500_000_000n)).toBe(1.5)
  })

  it('returns zero for an empty account', () => {
    expect(lamportsToSol(0n)).toBe(0)
  })

  it('converts a single lamport', () => {
    expect(lamportsToSol(1n)).toBe(1e-9)
  })
})
