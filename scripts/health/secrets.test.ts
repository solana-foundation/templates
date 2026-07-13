import { test } from 'node:test'
import assert from 'node:assert/strict'
import { envKeysRequiringCredentials } from './enumerate.js'

test('credential-looking variable names are detected', () => {
  const keys = envKeysRequiringCredentials('SUPABASE_API_KEY=\nPRIVY_APP_SECRET=abc\nWALLET_PRIVATE_KEY=')
  assert.deepEqual(keys, ['SUPABASE_API_KEY', 'PRIVY_APP_SECRET', 'WALLET_PRIVATE_KEY'])
})

test('the word secret in a comment does not count', () => {
  const keys = envKeysRequiringCredentials('# keep this secret and never commit your api key\nPORT=3000')
  assert.deepEqual(keys, [])
})

test('public config that mentions tokens or keys is not a credential', () => {
  const body = [
    'TOKEN_MINT=So11111111111111111111111111111111111111112',
    'SOLANA_RPC_URL=',
    'NEXT_PUBLIC_SUPABASE_URL=',
    'WALLET_PUBLIC_KEY=',
  ].join('\n')
  assert.deepEqual(envKeysRequiringCredentials(body), [])
})

test('supabase anon key counts even though it is NEXT_PUBLIC prefixed', () => {
  assert.deepEqual(envKeysRequiringCredentials('NEXT_PUBLIC_SUPABASE_ANON_KEY='), ['NEXT_PUBLIC_SUPABASE_ANON_KEY'])
})

test('blank lines and values never match', () => {
  const keys = envKeysRequiringCredentials('\n\nGREETING="my secret handshake"\n')
  assert.deepEqual(keys, [])
})
