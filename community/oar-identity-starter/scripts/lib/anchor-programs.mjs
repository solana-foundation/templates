// Narrow, read-only parser for Anchor.toml [programs.devnet] declarations.
// Fail closed on unsupported syntax; never infer authority or proof from a program ID.
import { address } from '@solana/kit'

export function parseAnchorDevnetPrograms(toml) {
  if (typeof toml !== 'string') throw new TypeError('Anchor.toml must be text.')
  let section = ''
  const seen = new Set()
  const programs = []
  for (const [i, raw] of toml
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .entries()) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    if (line.startsWith('[')) {
      if (!/^\[\[?[a-zA-Z0-9_.-]+\]\]?$/.test(line)) throw new Error('Invalid TOML section on line ' + (i + 1))
      section = line
      continue
    }
    if (section !== '[programs.devnet]') continue
    const match = line.match(/^([A-Za-z][A-Za-z0-9_-]*)\s*=\s*"([1-9A-HJ-NP-Za-km-z]{32,44})"\s*(?:#.*)?$/)
    if (!match) throw new Error('Unsupported [programs.devnet] entry on line ' + (i + 1))
    const [, name, program] = match
    if (seen.has(name)) throw new Error('Duplicate Anchor program name: ' + name)
    seen.add(name)
    try {
      address(program)
    } catch {
      throw new Error('Invalid Solana address for ' + name)
    }
    if (programs.includes(program)) throw new Error('Duplicate program address: ' + program)
    programs.push(program)
  }
  if (!programs.length) throw new Error('No [programs.devnet] program addresses found in Anchor.toml.')
  return programs
}
