import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseAnchorDevnetPrograms } from './anchor-programs.mjs'

const program = 'oariw8YXcYJh9sa9VcmBU3ZCdo2WVGMYPsLjEuUxfrC'
const creator = '91N96ZPGHcFWe2jEZie9rUVqyHF5BWMV7mYnHMurhWB7'
const prepare = fileURLToPath(new URL('../prepare-oar.mjs', import.meta.url))

test('Anchor importer accepts trailing comments on section headers', () => {
  assert.deepEqual(parseAnchorDevnetPrograms(`[provider] # wallet settings\n[programs.devnet] # deployment\nregistry = "${program}" # verified`), [program])
  assert.throws(() => parseAnchorDevnetPrograms(`[[programs.devnet] # unbalanced\nregistry = "${program}"`), /Invalid TOML section/)
})

test('unsafe JSON numeric nonce is rejected; decimal string preserves the App ID input', () => {
  const dir = mkdtempSync(join(tmpdir(), 'oar-starter-nonce-'))
  const config = join(dir, 'oar.config.json')
  const run = () => spawnSync(process.execPath, [prepare, '--creator', creator], { cwd: dir, encoding: 'utf8' })
  try {
    const common = '"standard":"0.1","cluster":"solana:devnet","name":"Nonce test","domain":"example.com"'
    writeFileSync(config, `{${common},"nonce":9007199254740993}`)
    const rejected = run()
    assert.equal(rejected.status, 1)
    assert.match(rejected.stderr, /safe integer/)

    writeFileSync(config, `{${common},"nonce":"9007199254740993"}`)
    const accepted = run()
    assert.equal(accepted.status, 0, accepted.stderr)
    assert.match(accepted.stdout, /creator nonce: 9007199254740993/)
    const manifest = JSON.parse(readFileSync(join(dir, 'public/.well-known/oar-manifest.json'), 'utf8'))
    assert.equal(manifest.app_id.length > 30, true)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})
