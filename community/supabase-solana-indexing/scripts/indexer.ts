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
type ExistingAccountSnapshot = Pick<
  Database['public']['Views']['indexed_program_accounts_read']['Row'],
  'account_address' | 'owner' | 'lamports' | 'executable' | 'rent_epoch' | 'data_base64' | 'data_size'
>

loadEnv({ path: '.env.local', quiet: true })
loadEnv({ quiet: true })

const MIN_STABLE_CONNECTION_MS = 30_000
const ADDRESS_FILTER_BATCH_SIZE = 100
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
    const cycleStartedAt = Date.now()
    try {
      await synchronize(shutdown.signal)
      reconnectAttempt = 0
    } catch (error) {
      if (shutdown.signal.aborted) break
      reconnectAttempt = Date.now() - cycleStartedAt >= MIN_STABLE_CONNECTION_MS ? 1 : reconnectAttempt + 1
      const delay = exponentialBackoffDelay(reconnectAttempt)
      console.error(`Synchronization failed; reconnecting in ${delay}ms`, error)
      await waitForDelay(delay, shutdown.signal)
    }
  }
}

async function synchronize(shutdownSignal: AbortSignal) {
  const cycle = new AbortController()
  const stopCycle = () => cycle.abort()
  let reconciliationRequested = false
  let reconciliationTimer: NodeJS.Timeout | undefined
  let streamTask: Promise<void> | undefined
  shutdownSignal.addEventListener('abort', stopCycle, { once: true })

  try {
    const notifications = await subscriptions
      .programNotifications(config.programAddress, {
        commitment: config.commitment,
        encoding: 'base64',
      })
      .subscribe({ abortSignal: cycle.signal })

    type ProgramNotification = typeof notifications extends AsyncIterable<infer T> ? T : never
    const queuedNotifications: ProgramNotification[] = []
    let bufferingNotifications = true
    const snapshot = { slot: undefined as bigint | undefined }
    let streamEnded = false
    let streamError: unknown

    async function applyNotification(notification: ProgramNotification) {
      if (snapshot.slot === undefined)
        throw new Error('Received a notification before the backfill snapshot was ready.')

      // getProgramAccounts already contains the final state at snapshotSlot.
      // Replaying older queued events would regress or incorrectly delete it.
      if (!isNotificationNewerThanSnapshot(notification.context.slot, snapshot.slot)) return

      const account = notification.value.account as EncodedAccount
      if (account.lamports === 0n) {
        await deleteAccount(notification.value.pubkey, notification.context.slot)
        return
      }

      const row = normalizeAccount(notification.value.pubkey, account, notification.context.slot)
      await upsertRows([row])
    }

    streamTask = (async () => {
      try {
        for await (const notification of notifications) {
          if (bufferingNotifications) {
            queuedNotifications.push(notification)
            continue
          }
          await applyNotification(notification)
        }
        streamEnded = true
      } catch (error) {
        streamError = error
        cycle.abort()
      }
    })()

    // Start consuming the async iterable before taking the snapshot. Kit's
    // subscription listener is registered when iteration begins, so this
    // explicit buffer keeps notifications observed during backfill instead of
    // relying on the iterable to queue them before the first pull.
    console.log('WebSocket subscription active')
    snapshot.slot = await backfill()

    while (queuedNotifications.length > 0) {
      await applyNotification(queuedNotifications.shift()!)
    }
    bufferingNotifications = false

    reconciliationTimer = setTimeout(() => {
      reconciliationRequested = true
      cycle.abort()
    }, config.reconcileIntervalMs)

    await streamTask
    if (streamError && !reconciliationRequested && !shutdownSignal.aborted) {
      throw streamError
    }
    if (streamEnded && !reconciliationRequested && !shutdownSignal.aborted) {
      throw new Error('Solana subscription ended unexpectedly')
    }
  } finally {
    clearTimeout(reconciliationTimer)
    cycle.abort()
    await streamTask?.catch(() => undefined)
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
    await upsertChangedRows(rows.slice(start, start + config.batchSize))
  }

  await deleteRowsMissingFromSnapshot(
    rows.map((row) => row.account_address),
    response.context.slot,
  )
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

async function upsertChangedRows(rows: AccountRow[]) {
  if (rows.length === 0) return
  const existingRows = await readExistingRowsInBatches(rows.map((row) => row.account_address))
  const existingByAddress = new Map(existingRows.map((row) => [row.account_address, row]))
  const changedRows = rows.filter((row) => {
    const existing = existingByAddress.get(row.account_address)
    return !existing || hasAccountDataChanged(row, existing)
  })
  await upsertRows(changedRows)
}

async function readExistingRowsInBatches(accountAddresses: string[]) {
  const rows: ExistingAccountSnapshot[] = []
  for (let start = 0; start < accountAddresses.length; start += ADDRESS_FILTER_BATCH_SIZE) {
    rows.push(...(await readExistingRows(accountAddresses.slice(start, start + ADDRESS_FILTER_BATCH_SIZE))))
  }
  return rows
}

async function readExistingRows(accountAddresses: string[]) {
  if (accountAddresses.length === 0) return []
  return await withRetry(
    async () => {
      const { data, error } = await supabase
        .from('indexed_program_accounts_read')
        .select('account_address,owner,lamports,executable,rent_epoch,data_base64,data_size')
        .eq('network', config.network)
        .eq('program_id', config.programId)
        .in('account_address', accountAddresses)
        .returns<ExistingAccountSnapshot[]>()
      if (error) throw error
      return data
    },
    { label: 'Supabase existing-row lookup' },
  )
}

function hasAccountDataChanged(row: AccountRow, existing: ExistingAccountSnapshot) {
  return (
    row.owner !== existing.owner ||
    row.lamports !== existing.lamports ||
    row.executable !== existing.executable ||
    row.rent_epoch !== existing.rent_epoch ||
    row.data_base64 !== existing.data_base64 ||
    row.data_size !== existing.data_size
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

async function readExistingAccountAddresses() {
  const addresses: string[] = []
  const pageSize = 1_000

  for (let start = 0; ; start += pageSize) {
    const page = await withRetry(
      async () => {
        const { data, error } = await supabase
          .from('indexed_program_accounts')
          .select('account_address')
          .eq('network', config.network)
          .eq('program_id', config.programId)
          .order('account_address')
          .range(start, start + pageSize - 1)
          .returns<Pick<AccountRow, 'account_address'>[]>()
        if (error) throw error
        return data
      },
      { label: 'Supabase existing-address lookup' },
    )

    addresses.push(...page.map((row) => row.account_address))
    if (page.length < pageSize) break
  }

  return addresses
}

async function deleteRowsMissingFromSnapshot(snapshotAddresses: string[], snapshotSlot: bigint) {
  const snapshotAddressSet = new Set(snapshotAddresses)
  const missingAddresses = (await readExistingAccountAddresses()).filter((address) => !snapshotAddressSet.has(address))
  for (let start = 0; start < missingAddresses.length; start += ADDRESS_FILTER_BATCH_SIZE) {
    await deleteRowsByAddress(missingAddresses.slice(start, start + ADDRESS_FILTER_BATCH_SIZE), snapshotSlot)
  }
}

async function deleteRowsByAddress(accountAddresses: string[], snapshotSlot: bigint) {
  if (accountAddresses.length === 0) return
  await withRetry(
    async () => {
      const { error } = await supabase
        .from('indexed_program_accounts')
        .delete()
        .eq('network', config.network)
        .eq('program_id', config.programId)
        .in('account_address', accountAddresses)
        .lte('slot', snapshotSlot.toString())
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

  if (!(['confirmed', 'finalized'] as string[]).includes(commitment)) {
    throw new Error('INDEXER_COMMITMENT must be confirmed or finalized')
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
