import { config as loadEnv } from 'dotenv'
import { address, createSolanaRpc, createSolanaRpcSubscriptions, type Address, type Commitment } from '@solana/kit'
import { createClient } from '@supabase/supabase-js'
import { exponentialBackoffDelay, waitForDelay, withRetry } from '../lib/retry'
import { isNotificationNewerThanSnapshot } from '../lib/slots'
import type { Database } from '../types/database'

type EncodedAccount = {
  data: readonly [string, string]
  executable: boolean
  lamports: bigint
  owner: Address
  rentEpoch?: bigint
  space?: bigint
}

type AccountRow = Database['public']['Tables']['indexed_program_accounts']['Insert']

loadEnv({ path: '.env.local', quiet: true })
loadEnv({ quiet: true })

const config = loadConfig()
const rpc = createSolanaRpc(config.rpcUrl)
const subscriptions = createSolanaRpcSubscriptions(config.wsUrl)
const supabase = createClient<Database>(config.supabaseUrl, config.serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

async function main() {
  console.log(`Indexing ${config.programId} on ${config.network} (${config.commitment})`)

  const shutdown = new AbortController()
  process.once('SIGINT', () => shutdown.abort())
  process.once('SIGTERM', () => shutdown.abort())

  let reconnectAttempt = 0
  while (!shutdown.signal.aborted) {
    try {
      await synchronize(shutdown.signal, () => {
        // A successful subscription and snapshot ends the consecutive-failure
        // streak even if this live connection later drops.
        reconnectAttempt = 0
      })
      reconnectAttempt = 0
    } catch (error) {
      if (shutdown.signal.aborted) break
      reconnectAttempt += 1
      const delay = exponentialBackoffDelay(reconnectAttempt)
      console.error(`Synchronization failed; reconnecting in ${delay}ms`, error)
      await waitForDelay(delay, shutdown.signal)
    }
  }
}

async function synchronize(shutdownSignal: AbortSignal, onSynchronized: () => void) {
  const cycle = new AbortController()
  const stopCycle = () => cycle.abort()
  let reconciliationRequested = false
  let reconciliationTimer: NodeJS.Timeout | undefined
  shutdownSignal.addEventListener('abort', stopCycle, { once: true })

  try {
    const notifications = await subscriptions
      .programNotifications(config.programAddress, {
        commitment: config.commitment,
        encoding: 'base64',
      })
      .subscribe({ abortSignal: cycle.signal })

    // Subscribe before taking the snapshot. Notifications that arrive during
    // the backfill remain queued and are applied afterward, closing the gap
    // between the snapshot and the live stream.
    console.log('WebSocket subscription active')
    const snapshotSlot = await backfill()
    onSynchronized()

    reconciliationTimer = setTimeout(() => {
      reconciliationRequested = true
      cycle.abort()
    }, config.reconcileIntervalMs)

    try {
      for await (const notification of notifications) {
        // getProgramAccounts already contains the final state at snapshotSlot.
        // Replaying older queued events would regress or incorrectly delete it.
        if (!isNotificationNewerThanSnapshot(notification.context.slot, snapshotSlot)) continue

        const account = notification.value.account as EncodedAccount
        if (account.lamports === 0n) {
          await deleteAccount(notification.value.pubkey, notification.context.slot)
          continue
        }

        const row = normalizeAccount(notification.value.pubkey, account, notification.context.slot)
        await upsertRows([row])
      }

      if (!reconciliationRequested && !shutdownSignal.aborted) {
        throw new Error('Solana subscription ended unexpectedly')
      }
    } catch (error) {
      if (!reconciliationRequested) throw error
    }
  } finally {
    clearTimeout(reconciliationTimer)
    cycle.abort()
    shutdownSignal.removeEventListener('abort', stopCycle)
  }
}

async function backfill() {
  const response = await withRetry(
    () =>
      rpc
        .getProgramAccounts(config.programAddress, {
          commitment: config.commitment,
          encoding: 'base64',
          withContext: true,
        })
        .send(),
    { label: 'Solana backfill' },
  )

  const rows = response.value.map(({ account, pubkey }) =>
    normalizeAccount(pubkey, account as EncodedAccount, response.context.slot),
  )

  for (let start = 0; start < rows.length; start += config.batchSize) {
    await upsertRows(rows.slice(start, start + config.batchSize))
  }

  await deleteRowsOlderThan(response.context.slot)
  console.log(`Backfill complete: ${rows.length} accounts at slot ${response.context.slot}`)
  return response.context.slot
}

function normalizeAccount(pubkey: Address, account: EncodedAccount, slot: bigint): AccountRow {
  return {
    network: config.network,
    program_id: config.programId,
    account_address: String(pubkey),
    owner: String(account.owner),
    lamports: account.lamports.toString(),
    executable: account.executable,
    rent_epoch: account.rentEpoch?.toString() ?? null,
    data_base64: account.data[0],
    data_size: account.space ? Number(account.space) : base64ByteLength(account.data[0]),
    slot: slot.toString(),
    updated_at: new Date().toISOString(),
  }
}

async function upsertRows(rows: AccountRow[]) {
  if (rows.length === 0) return
  await withRetry(
    async () => {
      const { error } = await supabase
        .from('indexed_program_accounts')
        .upsert(rows, { onConflict: 'network,program_id,account_address' })
      if (error) throw error
    },
    { label: 'Supabase upsert' },
  )
}

async function deleteAccount(accountAddress: Address, notificationSlot: bigint) {
  await withRetry(
    async () => {
      const { error } = await supabase
        .from('indexed_program_accounts')
        .delete()
        .eq('network', config.network)
        .eq('program_id', config.programId)
        .eq('account_address', String(accountAddress))
        .lte('slot', notificationSlot.toString())
      if (error) throw error
    },
    { label: 'Supabase account deletion' },
  )
}

async function deleteRowsOlderThan(snapshotSlot: bigint) {
  await withRetry(
    async () => {
      // Every account present in this snapshot was just stamped with its slot.
      // Older scoped rows were absent from getProgramAccounts and are stale.
      // Rows newer than the snapshot are preserved for multi-worker safety.
      const { error } = await supabase
        .from('indexed_program_accounts')
        .delete()
        .eq('network', config.network)
        .eq('program_id', config.programId)
        .lt('slot', snapshotSlot.toString())
      if (error) throw error
    },
    { label: 'Supabase stale-row reconciliation' },
  )
}

function base64ByteLength(value: string) {
  const padding = value.endsWith('==') ? 2 : value.endsWith('=') ? 1 : 0
  return Math.max(0, Math.floor((value.length * 3) / 4) - padding)
}

function loadConfig() {
  const supabaseUrl = required('NEXT_PUBLIC_SUPABASE_URL')
  const serviceRoleKey = required('SUPABASE_SERVICE_ROLE_KEY')
  const programId = required('NEXT_PUBLIC_SOLANA_PROGRAM_ID')
  const commitment = (process.env.INDEXER_COMMITMENT ?? 'confirmed') as Commitment

  if (!(['processed', 'confirmed', 'finalized'] as string[]).includes(commitment)) {
    throw new Error('INDEXER_COMMITMENT must be processed, confirmed, or finalized')
  }

  return {
    supabaseUrl,
    serviceRoleKey,
    programId,
    programAddress: address(programId),
    network: process.env.NEXT_PUBLIC_SOLANA_NETWORK ?? 'devnet',
    rpcUrl: process.env.SOLANA_RPC_URL ?? 'https://api.devnet.solana.com',
    wsUrl: process.env.SOLANA_WS_URL ?? 'wss://api.devnet.solana.com',
    commitment,
    batchSize: positiveInteger('INDEXER_BATCH_SIZE', process.env.INDEXER_BATCH_SIZE ?? '250'),
    reconcileIntervalMs: positiveInteger(
      'INDEXER_RECONCILE_INTERVAL_MS',
      process.env.INDEXER_RECONCILE_INTERVAL_MS ?? '300000',
    ),
  }
}

function required(name: string) {
  const value = process.env[name]
  if (!value || value.startsWith('YOUR_') || value.includes('YOUR_PROJECT')) {
    throw new Error(`Missing ${name}. Copy .env.example to .env.local and configure it.`)
  }
  return value
}

function positiveInteger(name: string, value: string) {
  const parsed = Number(value)
  if (!/^\d+$/.test(value) || !Number.isSafeInteger(parsed) || parsed <= 0) {
    throw new Error(`${name} must be a positive integer`)
  }
  return parsed
}

void main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
