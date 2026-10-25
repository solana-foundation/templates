import { afterEach, expect, test, vi } from 'vitest'
import { createClient, type User } from '@supabase/supabase-js'
import { createAppClient } from '../src/lib/solana-client'
import { CLUSTERS } from '../src/components/solana/clusters'
import { matchesWallet, signInWithWallet, signOutWalletSession } from '../src/lib/wallet-auth'
import { registerTestWallet } from './wallet-fixture'
import { parseSignInMessageText } from '@solana/wallet-standard-util'

afterEach(() => localStorage.clear())

test('finishes stale login cleanup before a remounted component can log in', async () => {
  const fixture = registerTestWallet()
  const client = createAppClient(CLUSTERS[0])
  let session: string | null = null
  let finishOld!: () => void
  const response = new Promise<void>((resolve) => {
    finishOld = resolve
  })
  let calls = 0
  const auth = {
    signInWithWeb3: vi.fn(async () => {
      const index = ++calls
      if (index === 1) await response
      session = index === 1 ? 'old-wallet' : 'new-wallet'
      return { data: { user: { id: session }, session: { access_token: session } }, error: null }
    }),
    signOut: vi.fn(async () => {
      session = null
      return { error: null }
    }),
    getSession: vi.fn(async () => ({ data: { session: { access_token: session } }, error: null })),
  } as unknown as ReturnType<typeof createClient>['auth']
  try {
    await vi.waitFor(() => expect(client.wallet.getState().wallets.length).toBe(1))
    await client.wallet.connect(client.wallet.getState().wallets[0])
    const controller = new AbortController()
    const old = signInWithWallet(auth, client, controller.signal).catch((error) => error)
    await vi.waitFor(() => expect(calls).toBe(1))
    controller.abort()
    fixture.change([fixture.second])
    const current = signInWithWallet(auth, client, new AbortController().signal)
    const staleCleanup = signOutWalletSession(auth, 'old-wallet')
    expect(calls).toBe(1)
    finishOld()
    expect(await old).toMatchObject({ name: 'AbortError' })
    await current
    await staleCleanup
    expect(session).toBe('new-wallet')
    expect(auth.signOut).toHaveBeenCalledTimes(1)
  } finally {
    finishOld()
    client[Symbol.dispose]()
    fixture.unregister()
  }
})

test('logout errors reach the caller and do not block the next operation', async () => {
  const error = new Error('Auth service unreachable')
  const auth = {
    signOut: vi.fn().mockResolvedValueOnce({ error }).mockResolvedValueOnce({ error: null }),
  } as unknown as ReturnType<typeof createClient>['auth']
  await expect(signOutWalletSession(auth)).rejects.toThrow('Auth service unreachable')
  await expect(signOutWalletSession(auth)).resolves.toBeUndefined()
})

test('a login cancelled while queued never requests another signature or session', async () => {
  const fixture = registerTestWallet()
  const client = createAppClient(CLUSTERS[0])
  let finish!: () => void
  const response = new Promise<void>((resolve) => {
    finish = resolve
  })
  const auth = {
    signInWithWeb3: vi.fn(async () => {
      await response
      return { data: { user: {}, session: {} }, error: null }
    }),
  } as unknown as ReturnType<typeof createClient>['auth']
  const sign = vi.spyOn(fixture.wallet.features['solana:signMessage'], 'signMessage')
  try {
    await vi.waitFor(() => expect(client.wallet.getState().wallets.length).toBe(1))
    await client.wallet.connect(client.wallet.getState().wallets[0])
    const first = signInWithWallet(auth, client, new AbortController().signal)
    await vi.waitFor(() => expect(auth.signInWithWeb3).toHaveBeenCalledTimes(1))
    const controller = new AbortController()
    const cancelled = signInWithWallet(auth, client, controller.signal).catch((error) => error)
    controller.abort()
    finish()
    await first
    expect(await cancelled).toMatchObject({ name: 'AbortError' })
    expect(sign).toHaveBeenCalledTimes(1)
    expect(auth.signInWithWeb3).toHaveBeenCalledTimes(1)
  } finally {
    finish()
    client[Symbol.dispose]()
    fixture.unregister()
  }
})

test('does not sign out a newer session while clearing an old wallet session', async () => {
  const auth = {
    getSession: vi.fn(async () => ({ data: { session: { access_token: 'new-session' } }, error: null })),
    signOut: vi.fn(),
  } as unknown as ReturnType<typeof createClient>['auth']
  await signOutWalletSession(auth, 'old-session')
  expect(auth.signOut).not.toHaveBeenCalled()
})

test('Supabase receives the selected wallet address and its signed challenge, not window.solana', async () => {
  const fixture = registerTestWallet()
  const client = createAppClient(CLUSTERS[0])
  let request: Record<string, unknown> = {}
  const fetch = vi.fn(async (_url, options) => {
    request = JSON.parse(String(options?.body))
    return new Response(
      JSON.stringify({ error: 'Expected test response', error_description: 'Web3 disabled in test' }),
      { status: 422, headers: { 'Content-Type': 'application/json' } },
    )
  })
  const supabase = createClient('http://localhost:54321', 'test-anon-key', {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch },
  })
  try {
    await vi.waitFor(() => expect(client.wallet.getState().wallets.length).toBe(1))
    await client.wallet.connect(client.wallet.getState().wallets[0])
    await expect(signInWithWallet(supabase.auth, client, new AbortController().signal)).rejects.toThrow()
    expect(request.chain).toBe('solana')
    expect(request.message).toContain(fixture.first.address)
    const parsed = parseSignInMessageText(String(request.message))
    expect(parsed).not.toBeNull()
    expect(parsed?.address).toBe(fixture.first.address)
    expect(parsed?.domain).toBe(window.location.host)
    expect(parsed?.nonce).toMatch(/^[a-zA-Z0-9]{8,}$/)
    expect(String(request.message).indexOf('URI:')).toBeLessThan(String(request.message).indexOf('Version:'))
    expect(request.signature).toBeTruthy()
    expect(fetch).toHaveBeenCalledTimes(1)
  } finally {
    client[Symbol.dispose]()
    fixture.unregister()
    supabase.auth.stopAutoRefresh()
  }
})

test('rejects a disconnected wallet before contacting Supabase', async () => {
  const client = createAppClient(CLUSTERS[0])
  const auth = { signInWithWeb3: vi.fn() } as unknown as ReturnType<typeof createClient>['auth']
  try {
    await expect(signInWithWallet(auth, client, new AbortController().signal)).rejects.toThrow('Connect a wallet')
    expect(auth.signInWithWeb3).not.toHaveBeenCalled()
  } finally {
    client[Symbol.dispose]()
  }
})

test('matches only the authenticated Solana identity', () => {
  const user = {
    identities: [{ provider: 'web3', identity_data: { custom_claims: { address: 'A', chain: 'solana' } } }],
  } as unknown as User
  expect(matchesWallet(user, 'A')).toBe(true)
  expect(matchesWallet(user, 'B')).toBe(false)
  expect(matchesWallet(user, undefined)).toBe(false)
  expect(matchesWallet(null, 'A')).toBe(false)
})

test('drops a response that arrives after the selected wallet changed', async () => {
  const fixture = registerTestWallet()
  const client = createAppClient(CLUSTERS[0])
  const signOut = vi.fn(async () => ({ error: null }))
  const auth = {
    signInWithWeb3: vi.fn(async () => {
      fixture.change([fixture.second])
      return { data: { user: { id: 'previous-wallet' }, session: {} }, error: null }
    }),
    signOut,
  } as unknown as ReturnType<typeof createClient>['auth']
  try {
    await vi.waitFor(() => expect(client.wallet.getState().wallets.length).toBe(1))
    await client.wallet.connect(client.wallet.getState().wallets[0])
    await expect(signInWithWallet(auth, client, new AbortController().signal)).rejects.toThrow('Wallet changed')
    expect(signOut).toHaveBeenCalledWith({ scope: 'local' })
  } finally {
    client[Symbol.dispose]()
    fixture.unregister()
  }
})

test('does not contact Supabase after an aborted request', async () => {
  const fixture = registerTestWallet()
  const client = createAppClient(CLUSTERS[0])
  const auth = { signInWithWeb3: vi.fn() } as unknown as ReturnType<typeof createClient>['auth']
  try {
    await vi.waitFor(() => expect(client.wallet.getState().wallets.length).toBe(1))
    await client.wallet.connect(client.wallet.getState().wallets[0])
    const controller = new AbortController()
    controller.abort()
    await expect(signInWithWallet(auth, client, controller.signal)).rejects.toThrow()
    expect(auth.signInWithWeb3).not.toHaveBeenCalled()
  } finally {
    client[Symbol.dispose]()
    fixture.unregister()
  }
})
