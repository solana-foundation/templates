#!/usr/bin/env node
// Offline preparation only. Derives an App ID from a PUBLIC key and produces validated files.
// No signer material, RPC calls, transactions, deployment, or implicit registration.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { address } from '@solana/kit'
import * as sdk from '@open-app-registry/sdk'
import { checkManifestUri as localCheckManifestUri } from './lib/manifest-uri.mjs'

/** `pnpm run x -- --flag` forwards the `--` separator itself; npm and yarn strip it. */
const cliArgs = () => (process.argv[2] === '--' ? process.argv.slice(3) : process.argv.slice(2))

const { buildClaimFiles, findAppId, hashManifestHex, validateManifest } = sdk
const checkManifestUri = sdk.checkManifestUri ?? localCheckManifestUri

function fail(reason) {
  throw new Error(reason)
}
function parse(argv) {
  let creator,
    force = false,
    nonce
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--creator' && !creator) creator = argv[++i]
    else if (arg === '--nonce' && nonce === undefined) {
      if (i + 1 >= argv.length || argv[i + 1].startsWith('--'))
        fail('--nonce requires a non-negative decimal integer.')
      nonce = argv[++i]
    }
    else if (arg === '--force') force = true
    else fail('Unexpected or repeated option: ' + arg)
  }
  if (!creator || !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(creator))
    fail('Provide --creator with a public Solana wallet address (not a keypair file).')
  if (nonce !== undefined && !/^(0|[1-9][0-9]*)$/.test(nonce)) fail('--nonce must be a non-negative decimal integer.')
  return { creator: address(creator), nonce, force }
}
function save(path, value, force) {
  if (existsSync(path) && !force) fail('File exists: ' + path + ' (review changes and pass --force to overwrite).')
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, JSON.stringify(value, null, 2) + '\n', { flag: 'w' })
}
async function main() {
  const opts = parse(cliArgs())
  const cfg = JSON.parse(readFileSync('oar.config.json', 'utf8'))
  if (cfg.standard !== '0.1' || cfg.cluster !== 'solana:devnet')
    fail('This starter only supports OAR standard 0.1 on solana:devnet.')
  if (opts.nonce === undefined && typeof cfg.nonce === 'number' && !Number.isSafeInteger(cfg.nonce))
    fail('Config nonce is not a safe integer; use a decimal string or --nonce for larger values.')
  const n = opts.nonce ?? String(cfg.nonce ?? 0)
  if (!/^(0|[1-9][0-9]*)$/.test(n)) fail('Invalid config nonce.')
  const nonce = BigInt(n)
  if (nonce > 18446744073709551615n) fail('Nonce exceeds u64.')
  const appId = await findAppId({ creator: opts.creator, nonce })
  const domains = cfg.domain ? [cfg.domain] : []
  const repos = cfg.repositories ?? []
  const programs = cfg.programs ?? []
  if (!Array.isArray(repos) || !Array.isArray(programs)) fail('repositories and programs must be arrays.')
  if (cfg.manifestUri !== undefined && typeof cfg.manifestUri !== 'string') fail('manifestUri must be a string.')
  if (cfg.manifestUri) {
    const policy = checkManifestUri(cfg.manifestUri.trim())
    if (!policy.ok) fail('Manifest URI refused: ' + policy.detail)
  }
  const files = buildClaimFiles({
    appId,
    cluster: cfg.cluster,
    name: cfg.name,
    ...(cfg.summary ? { summary: cfg.summary } : {}),
    categories: [cfg.category ?? 'other'],
    domains,
    repositories: repos,
    programs: programs.map((p) => address(p)),
    ...(cfg.manifestUri ? { manifestUri: cfg.manifestUri } : {}),
  })
  const verified = validateManifest(files.manifest)
  if (!verified.valid) fail('Manifest failed SDK validation: ' + verified.errors.join('; '))
  const policy = checkManifestUri(files.manifestUri)
  if (!policy.ok) fail('Manifest URI refused: ' + policy.detail)
  const outputs = [
    ['public/.well-known/oar-manifest.json', files.manifest],
    ...(domains.length ? [['public/.well-known/oar.json', files.wellKnown]] : []),
    ...(repos.length ? [['oar.json', files.repoProof]] : []),
  ]
  if (repos.length === 0 && existsSync('oar.json'))
    fail('Stale oar.json exists but no repository is claimed; remove it after reviewing.')
  if (domains.length === 0 && existsSync('public/.well-known/oar.json'))
    fail('Stale domain proof public/.well-known/oar.json exists but no domain is claimed; remove it after reviewing.')
  if (!opts.force) {
    for (const [path] of outputs) if (existsSync(path)) fail('Refusing to overwrite ' + path + '; use --force.')
  }
  for (const [path, value] of outputs) save(resolve(path), value, opts.force)
  console.log('App ID: ' + appId)
  console.log('Cluster: solana:devnet | creator nonce: ' + nonce)
  console.log('Manifest URI: ' + files.manifestUri)
  console.log('Manifest SHA-256 (RFC 8785): ' + hashManifestHex(files.manifest))
  console.log('Prepared ' + outputs.map(([path]) => path).join(', '))
  console.log(
    'Not registered. Deploy these files, verify hosting, then sign registration at https://oarprotocol.xyz/register.',
  )
  if (programs.length)
    console.log('Each listed program also needs its upgrade-authority-signed canonical OAR backlink.')
}
main().catch((e) => {
  console.error('oar:prepare: ' + e.message)
  process.exitCode = 1
})
