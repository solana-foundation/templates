#!/usr/bin/env node
// Import public Anchor Devnet program IDs into OAR config with explicit confirmation.
// Does not run Anchor, sign transactions, or treat a declared address as deployed or verified.
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { parseAnchorDevnetPrograms } from './lib/anchor-programs.mjs'

/** `pnpm run x -- --flag` forwards the `--` separator itself; npm and yarn strip it. */
const cliArgs = () => (process.argv[2] === '--' ? process.argv.slice(3) : process.argv.slice(2))

function fail(msg) {
  throw new Error(msg)
}
function parse(args) {
  const options = { workspace: '.', yes: false, replace: false }
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === '--workspace') {
      if (options.workspace !== '.' || !args[i + 1] || args[i + 1].startsWith('--'))
        fail('Invalid --workspace argument.')
      options.workspace = args[++i]
    } else if (a === '--yes') {
      if (options.yes) fail('Repeated --yes.')
      options.yes = true
    } else if (a === '--replace') {
      if (options.replace) fail('Repeated --replace.')
      options.replace = true
    } else fail('Unknown argument: ' + a)
  }
  if (options.replace && !options.yes) fail('--replace requires --yes (writes must be explicit).')
  return options
}
function same(a, b) {
  return a.length === b.length && a.every((v, i) => v === b[i])
}
function main() {
  const o = parse(cliArgs())
  const path = join(resolve(o.workspace), 'Anchor.toml')
  if (!existsSync(path)) fail('No Anchor.toml found at ' + path)
  const ids = parseAnchorDevnetPrograms(readFileSync(path, 'utf8'))
  const configPath = resolve('oar.config.json')
  const cfg = JSON.parse(readFileSync(configPath, 'utf8'))
  if (cfg.cluster !== 'solana:devnet' || cfg.standard !== '0.1')
    fail('Only OAR App Standard 0.1 Devnet config is supported.')
  if (!Array.isArray(cfg.programs) || !cfg.programs.every((v) => typeof v === 'string'))
    fail('oar.config.json programs must be an array of addresses.')
  const current = cfg.programs
  console.log('Anchor program addresses on Devnet (declarations, NOT deployed proofs):')
  for (const id of ids) console.log('  ' + id)
  if (same(current, ids)) return console.log('OAR config already matches. No change.')
  if (!o.yes) return console.log('Preview only. Run again with --yes to update oar.config.json.')
  if (current.length && !o.replace)
    fail('Refusing to replace existing program list; use --yes --replace after reviewing the preview.')
  writeFileSync(configPath, JSON.stringify({ ...cfg, programs: ids }, null, 2) + '\n')
  console.log('Updated local oar.config.json. No transaction was sent.')
  console.log('Run npm run oar:prepare when ready, then link deployed programs with their upgrade authority.')
}
try {
  main()
} catch (e) {
  console.error('oar:anchor: ' + e.message)
  process.exitCode = 1
}
