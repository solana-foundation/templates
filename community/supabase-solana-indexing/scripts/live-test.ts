import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process'
import { resolve } from 'node:path'
import { config as loadEnv } from 'dotenv'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

type AccountRow = Database['public']['Tables']['indexed_program_accounts']['Row']

loadEnv({ path: '.env.local', quiet: true })
loadEnv({ quiet: true })

const config = {
  supabaseUrl: required('NEXT_PUBLIC_SUPABASE_URL'),
  anonKey: required('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  serviceRoleKey: required('SUPABASE_SERVICE_ROLE_KEY'),
  network: process.env.NEXT_PUBLIC_SOLANA_NETWORK ?? 'devnet',
  programId: required('NEXT_PUBLIC_SOLANA_PROGRAM_ID'),
  timeoutMs: positiveInteger(process.env.LIVE_TEST_TIMEOUT_MS ?? '90000'),
  requireSolanaUpdate: process.env.LIVE_TEST_REQUIRE_SOLANA_UPDATE === 'true',
}

const service = createClient<Database>(config.supabaseUrl, config.serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})
const anonymous = createClient<Database>(config.supabaseUrl, config.anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

async function main() {
  console.log(`Live test: ${config.programId} on ${config.network}`)
  await assertMigrationApplied()

  const indexer = startIndexer()
  try {
    const output = await waitForIndexer(indexer)
    const match = output.match(/Backfill complete: (\d+) accounts at slot (\d+)/)
    if (!match || Number(match[1]) === 0) {
      throw new Error('The backfill returned zero accounts; choose a devnet program with at least one owned account.')
    }

    const indexed = await readIndexedState(service)
    if (indexed.count !== Number(match[1])) {
      throw new Error(`Supabase has ${indexed.count} rows, but the Solana backfill reported ${match[1]}.`)
    }

    const publicIndexed = await readIndexedState(anonymous)
    if (publicIndexed.count !== indexed.count) {
      throw new Error(`Anonymous read counted ${publicIndexed.count} of ${indexed.count} indexed rows.`)
    }

    await assertMonotonicSlotPersistence(BigInt(match[2]))
    await assertExactU64Read(BigInt(match[2]))

    if (config.requireSolanaUpdate) {
      console.log('Waiting for an indexed account to change on Solana after the backfill snapshot...')
      await waitForIndexedSolanaUpdate(BigInt(match[2]))
      console.log('PASS: a post-snapshot Solana account change reached Supabase')
    } else {
      await assertReconciliationSkipsUnchangedRows(indexer, indexed.row)
    }

    await assertAnonymousWritesAreBlocked(indexed.row)
    await assertRealtimeDeliveryWithRetry(indexed.row)

    console.log(`PASS: indexed ${indexed.count} accounts at slot ${match[2]}`)
    console.log('PASS: Solana WebSocket subscription connected')
    console.log('PASS: anonymous reads allowed and anonymous writes blocked')
    console.log('PASS: Supabase Realtime delivered a database change')
  } finally {
    await stopIndexer(indexer)
    await Promise.all([anonymous.removeAllChannels(), service.removeAllChannels()])
  }
}

async function assertReconciliationSkipsUnchangedRows(
  indexer: ChildProcessWithoutNullStreams,
  row: Pick<AccountRow, 'account_address'>,
) {
  await stopIndexer(indexer)

  const before = await readAccountUpdatedAt(row.account_address)
  const reconcileIndexer = startIndexer()
  try {
    await waitForIndexer(reconcileIndexer)
  } finally {
    await stopIndexer(reconcileIndexer)
  }

  const after = await readAccountUpdatedAt(row.account_address)
  if (after.updated_at !== before.updated_at) {
    throw new Error('Reconciliation rewrote an unchanged row; unchanged accounts should not emit Realtime noise.')
  }

  console.log('PASS: reconciliation skips unchanged rows')
}

async function readAccountUpdatedAt(accountAddress: string) {
  const { data, error } = await service
    .from('indexed_program_accounts')
    .select('updated_at')
    .eq('network', config.network)
    .eq('program_id', config.programId)
    .eq('account_address', accountAddress)
    .single()

  if (error) throw new Error(`Reconciliation fixture query failed: ${error.message}`)
  return data
}

async function assertMigrationApplied() {
  const { error } = await service.from('indexed_program_accounts').select('account_address').limit(1)
  if (error) {
    throw new Error(
      `Migration preflight failed: ${error.message}. Run supabase/migrations/20260715000000_create_program_accounts.sql first.`,
    )
  }
}

function startIndexer() {
  const tsxCli = resolve('node_modules', 'tsx', 'dist', 'cli.mjs')
  return spawn(process.execPath, [tsxCli, 'scripts/indexer.ts'], {
    cwd: process.cwd(),
    env: process.env,
    stdio: ['pipe', 'pipe', 'pipe'],
  })
}

async function waitForIndexer(indexer: ChildProcessWithoutNullStreams) {
  let output = ''
  const ready = new Promise<string>((resolveReady, reject) => {
    const capture = (chunk: Buffer) => {
      const text = chunk.toString()
      output += text
      process.stdout.write(text)
      if (output.includes('Backfill complete:') && output.includes('WebSocket subscription active')) {
        resolveReady(output)
      }
    }

    indexer.stdout.on('data', capture)
    indexer.stderr.on('data', capture)
    indexer.once('error', reject)
    indexer.once('exit', (code) => {
      if (!output.includes('WebSocket subscription active')) {
        reject(new Error(`Indexer exited before it was ready (code ${code ?? 'unknown'}).`))
      }
    })
  })

  return withTimeout(ready, config.timeoutMs, 'Timed out waiting for the indexer backfill and WebSocket subscription.')
}

async function readIndexedState(client: SupabaseClient<Database>) {
  const { data, count, error } = await client
    .from('indexed_program_accounts')
    .select('*', { count: 'exact' })
    .eq('network', config.network)
    .eq('program_id', config.programId)
    .order('account_address')
    .limit(1)
    .returns<AccountRow[]>()

  if (error) throw new Error(`Indexed row query failed: ${error.message}`)
  if (!data[0] || count === null) throw new Error('The indexed account query returned no rows or count.')
  return { row: data[0], count }
}

async function waitForIndexedSolanaUpdate(backfillSlot: bigint) {
  const deadline = Date.now() + config.timeoutMs
  while (Date.now() < deadline) {
    const { data, error } = await service
      .from('indexed_program_accounts')
      .select('slot')
      .eq('network', config.network)
      .eq('program_id', config.programId)
      .gt('slot', backfillSlot.toString())
      .limit(1)

    if (error) throw new Error(`Solana update verification query failed: ${error.message}`)
    if (data.length > 0) return
    await new Promise((resolvePoll) => setTimeout(resolvePoll, 500))
  }

  throw new Error(
    'Timed out waiting for a post-snapshot Solana account change. Submit a devnet transaction that changes an indexed account.',
  )
}

async function assertMonotonicSlotPersistence(snapshotSlot: bigint) {
  const accountAddress = 'SlotGuard1111111111111111111111111111111111'
  const newerSlot = snapshotSlot + 2n
  const staleSlot = snapshotSlot + 1n
  const row: Database['public']['Tables']['indexed_program_accounts']['Insert'] = {
    network: config.network,
    program_id: config.programId,
    account_address: accountAddress,
    owner: config.programId,
    lamports: '2',
    executable: false,
    rent_epoch: '0',
    data_base64: '',
    data_size: 0,
    slot: newerSlot.toString(),
  }

  try {
    const { error: insertError } = await service
      .from('indexed_program_accounts')
      .upsert(row, { onConflict: 'network,program_id,account_address' })
    if (insertError) throw new Error(`Slot guard fixture insert failed: ${insertError.message}`)

    const { error: staleUpdateError } = await service
      .from('indexed_program_accounts')
      .upsert(
        { ...row, lamports: '1', slot: staleSlot.toString() },
        { onConflict: 'network,program_id,account_address' },
      )
    if (staleUpdateError) throw new Error(`Stale slot update request failed: ${staleUpdateError.message}`)

    const persisted = await readAccount(accountAddress)
    if (String(persisted.slot) !== newerSlot.toString() || String(persisted.lamports) !== '2') {
      throw new Error(`Stale update replaced slot ${newerSlot}; apply the monotonic-slot migration guard.`)
    }

    const { error: staleDeleteError } = await service
      .from('indexed_program_accounts')
      .delete()
      .eq('network', config.network)
      .eq('program_id', config.programId)
      .eq('account_address', accountAddress)
      .lte('slot', staleSlot.toString())
    if (staleDeleteError) throw new Error(`Stale slot deletion request failed: ${staleDeleteError.message}`)

    await readAccount(accountAddress)
    console.log('PASS: stale persisted updates and deletions are rejected by slot')
  } finally {
    await service
      .from('indexed_program_accounts')
      .delete()
      .eq('network', config.network)
      .eq('program_id', config.programId)
      .eq('account_address', accountAddress)
  }
}

async function readAccount(accountAddress: string) {
  const { data, error } = await service
    .from('indexed_program_accounts')
    .select('lamports,slot')
    .eq('network', config.network)
    .eq('program_id', config.programId)
    .eq('account_address', accountAddress)
    .single()

  if (error) throw new Error(`Slot guard fixture query failed: ${error.message}`)
  return data
}

async function assertExactU64Read(snapshotSlot: bigint) {
  const accountAddress = 'PrecisionGuard111111111111111111111111111111'
  const maxU64 = '18446744073709551615'
  const row: Database['public']['Tables']['indexed_program_accounts']['Insert'] = {
    network: config.network,
    program_id: config.programId,
    account_address: accountAddress,
    owner: config.programId,
    lamports: maxU64,
    executable: false,
    rent_epoch: maxU64,
    data_base64: '',
    data_size: 0,
    slot: (snapshotSlot + 3n).toString(),
  }

  try {
    const { error: insertError } = await service.from('indexed_program_accounts').insert(row)
    if (insertError) throw new Error(`Precision fixture insert failed: ${insertError.message}`)

    const { data, error } = await anonymous
      .from('indexed_program_accounts_read')
      .select('lamports,rent_epoch')
      .eq('network', config.network)
      .eq('program_id', config.programId)
      .eq('account_address', accountAddress)
      .gte('lamports_numeric', maxU64)
      .single()

    if (error) throw new Error(`Exact u64 read failed: ${error.message}`)
    if (data.lamports !== maxU64 || data.rent_epoch !== maxU64) {
      throw new Error(`Exact u64 values were rounded: ${data.lamports}, ${data.rent_epoch}`)
    }

    console.log('PASS: maximum u64 values survive an anonymous Supabase round trip exactly')
  } finally {
    await service
      .from('indexed_program_accounts')
      .delete()
      .eq('network', config.network)
      .eq('program_id', config.programId)
      .eq('account_address', accountAddress)
  }
}

async function assertAnonymousWritesAreBlocked(row: AccountRow) {
  const { error } = await anonymous.from('indexed_program_accounts').upsert(row, {
    onConflict: 'network,program_id,account_address',
  })
  if (!error) throw new Error('Anonymous write unexpectedly succeeded; check the table RLS policies.')
}

async function assertRealtimeDeliveryWithRetry(row: AccountRow) {
  const attempts = 3
  const attemptTimeoutMs = Math.max(1_000, Math.min(30_000, Math.floor(config.timeoutMs / attempts)))
  let lastError: unknown

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await assertRealtimeDelivery(row, attemptTimeoutMs)
      return
    } catch (error) {
      lastError = error
      if (attempt === attempts) break
      console.warn(`Supabase Realtime attempt ${attempt}/${attempts} failed; retrying`, error)
      await new Promise((resolveRetry) => setTimeout(resolveRetry, 1_000))
    }
  }

  const message = lastError instanceof Error ? lastError.message : String(lastError)
  throw new Error(`Supabase Realtime failed after ${attempts} attempts: ${message}`)
}

async function assertRealtimeDelivery(row: AccountRow, timeoutMs: number) {
  const changedAt = new Date(Date.now() + 1_000).toISOString()
  let resolveChange: (() => void) | undefined
  let rejectChange: ((error: Error) => void) | undefined
  const received = new Promise<void>((resolveReceived, rejectReceived) => {
    resolveChange = resolveReceived
    rejectChange = rejectReceived
  })

  const channel = anonymous
    .channel(`live-test-${Date.now()}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'indexed_program_accounts',
        filter: `account_address=eq.${row.account_address}`,
      },
      (payload) => {
        if (Date.parse((payload.new as AccountRow).updated_at) === Date.parse(changedAt)) resolveChange?.()
      },
    )
    .subscribe(async (status) => {
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        rejectChange?.(new Error(`Supabase Realtime subscription failed with status ${status}.`))
      }
      if (status !== 'SUBSCRIBED') return

      const { error } = await service
        .from('indexed_program_accounts')
        .update({ updated_at: changedAt })
        .eq('network', row.network)
        .eq('program_id', row.program_id)
        .eq('account_address', row.account_address)
      if (error) rejectChange?.(new Error(`Realtime test update failed: ${error.message}`))
    })

  try {
    await withTimeout(received, timeoutMs, 'Timed out waiting for a Supabase Realtime change.')
  } finally {
    await anonymous.removeChannel(channel)
  }
}

async function stopIndexer(indexer: ChildProcessWithoutNullStreams) {
  if (indexer.exitCode !== null || indexer.killed) return
  indexer.kill('SIGTERM')
  await withTimeout(
    new Promise<void>((resolveExit) => indexer.once('exit', () => resolveExit())),
    5_000,
    'Indexer did not stop cleanly.',
  ).catch(() => indexer.kill('SIGKILL'))
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string) {
  return new Promise<T>((resolvePromise, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), timeoutMs)
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolvePromise(value)
      },
      (error) => {
        clearTimeout(timer)
        reject(error)
      },
    )
  })
}

function required(name: string) {
  const value = process.env[name]
  if (!value || value.startsWith('YOUR_') || value.includes('YOUR_PROJECT')) {
    throw new Error(`Missing ${name}. Copy .env.example to .env.local and configure it.`)
  }
  return value
}

function positiveInteger(value: string) {
  const parsed = Number(value)
  if (!/^\d+$/.test(value) || !Number.isSafeInteger(parsed) || parsed <= 0) {
    throw new Error('LIVE_TEST_TIMEOUT_MS must be a positive integer')
  }
  return parsed
}

void main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
