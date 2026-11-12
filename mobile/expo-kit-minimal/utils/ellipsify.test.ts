import { describe, expect, it } from 'vitest'
import { ellipsify } from '@/utils/ellipsify'

describe('ellipsify', () => {
  it('keeps the first and last characters of a long string', () => {
    expect(ellipsify('GsbwXfJraMomNxBcjK9jJ3YuPBQTd7pTvbwEfJvvZoP1')).toBe('Gsbw..ZoP1')
  })

  it('leaves a string shorter than the limit untouched', () => {
    expect(ellipsify('abcdefgh')).toBe('abcdefgh')
  })

  it('shortens a string exactly at the limit', () => {
    expect(ellipsify('abcdefghij')).toBe('abcd..ghij')
  })

  it('respects a custom length and delimiter', () => {
    expect(ellipsify('GsbwXfJraMomNxBcjK9jJ3YuPBQTd7pTvbwEfJvvZoP1', 6, '...')).toBe('GsbwXf...vvZoP1')
  })

  it('handles an empty or missing string', () => {
    expect(ellipsify()).toBe('')
    expect(ellipsify('')).toBe('')
  })
})
