'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/browser'
import type { IndexedProgramAccountRead } from '@/types/database'

const PAGE_SIZE = 12
const ACCOUNT_COLUMNS = 'account_address,owner,lamports,data_size,updated_at' as const
const BASE58_PREFIX = /^[1-9A-HJ-NP-Za-km-z]*$/
const DECIMAL_INTEGER = /^\d*$/

type AccountSummary = Pick<
  IndexedProgramAccountRead,
  'account_address' | 'owner' | 'lamports' | 'data_size' | 'updated_at'
>

export function AccountsDashboard({ network, programId }: { network: string; programId: string }) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), [])
  const [accounts, setAccounts] = useState<AccountSummary[]>([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(0)
  const [prefix, setPrefix] = useState('')
  const [minimumLamports, setMinimumLamports] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const latestRequest = useRef(0)
  const loadAccountsRef = useRef<() => Promise<void>>(async () => undefined)

  const loadAccounts = useCallback(async () => {
    const request = ++latestRequest.current
    if (!supabase || !programId) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    let query = supabase
      .from('indexed_program_accounts_read')
      .select(ACCOUNT_COLUMNS, { count: 'exact' })
      .eq('network', network)
      .eq('program_id', programId)
      .order('updated_at', { ascending: false })
      .order('account_address', { ascending: true })
      .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1)

    if (prefix) query = query.like('account_address', `${prefix}%`)
    if (minimumLamports) query = query.gte('lamports_numeric', minimumLamports)

    const result = await query
    if (request !== latestRequest.current) return
    if (result.error) {
      setError(result.error.message)
    } else {
      const nextCount = result.count ?? 0
      const nextLastPage = Math.max(0, Math.ceil(nextCount / PAGE_SIZE) - 1)
      if (page > nextLastPage) {
        setCount(nextCount)
        setPage(nextLastPage)
        return
      }

      setAccounts(result.data ?? [])
      setCount(nextCount)
    }
    setLoading(false)
  }, [minimumLamports, network, page, prefix, programId, supabase])

  useEffect(() => {
    loadAccountsRef.current = loadAccounts
  }, [loadAccounts])

  useEffect(() => {
    const timer = window.setTimeout(() => void loadAccounts(), 0)
    return () => window.clearTimeout(timer)
  }, [loadAccounts])

  useEffect(() => {
    if (!supabase || !programId) return
    let refreshTimer: number | undefined
    const scheduleRefresh = () => {
      window.clearTimeout(refreshTimer)
      refreshTimer = window.setTimeout(() => void loadAccountsRef.current(), 250)
    }
    const channel = supabase
      .channel(`accounts:${network}:${programId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'indexed_program_accounts',
          filter: `program_id=eq.${programId}`,
        },
        scheduleRefresh,
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'indexed_program_accounts',
          filter: `program_id=eq.${programId}`,
        },
        scheduleRefresh,
      )
      .on(
        'postgres_changes',
        {
          // Supabase Postgres Changes does not support filters on DELETE.
          event: 'DELETE',
          schema: 'public',
          table: 'indexed_program_accounts',
        },
        scheduleRefresh,
      )
      .subscribe()

    return () => {
      window.clearTimeout(refreshTimer)
      void supabase.removeChannel(channel)
    }
  }, [network, programId, supabase])

  if (!supabase || !programId) {
    return <SetupCard message="Copy .env.example to .env.local and set your Supabase values and Solana program ID." />
  }

  const lastPage = Math.max(0, Math.ceil(count / PAGE_SIZE) - 1)

  return (
    <section className="space-y-5">
      <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 md:grid-cols-[1fr_1fr_auto]">
        <input
          aria-label="Account address prefix"
          className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-emerald-400/50"
          maxLength={44}
          onChange={(event) => {
            const value = event.target.value.trim()
            if (!BASE58_PREFIX.test(value)) return
            setPage(0)
            setPrefix(value)
          }}
          placeholder="Account address prefix"
          value={prefix}
        />
        <input
          aria-label="Minimum lamports"
          className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-emerald-400/50"
          inputMode="numeric"
          maxLength={20}
          onChange={(event) => {
            const value = event.target.value
            if (!DECIMAL_INTEGER.test(value)) return
            setPage(0)
            setMinimumLamports(value)
          }}
          placeholder="Minimum lamports"
          type="text"
          value={minimumLamports}
        />
        <button
          className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-emerald-950 hover:bg-emerald-300"
          onClick={() => void loadAccounts()}
          type="button"
        >
          Refresh
        </button>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-400">
        <span>{count.toLocaleString()} indexed accounts</span>
        <span className="font-mono text-xs">{shorten(programId, 10)}</span>
      </div>

      {error ? <SetupCard message={error} /> : null}
      {loading ? <p className="py-16 text-center text-slate-500">Loading...</p> : null}
      {!loading && !error && accounts.length === 0 ? (
        <SetupCard message="No rows yet. Start the indexer with npm run indexer." />
      ) : null}

      <div className="grid gap-3">
        {accounts.map((account) => (
          <article
            className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-5 md:grid-cols-[1.4fr_0.8fr_0.8fr] md:items-center"
            key={account.account_address}
          >
            <div className="min-w-0">
              <p className="truncate font-mono text-sm text-emerald-300">{account.account_address}</p>
              <p className="mt-2 truncate font-mono text-xs text-slate-500">owner {account.owner}</p>
            </div>
            <Metric label="Lamports" value={BigInt(account.lamports).toLocaleString()} />
            <Metric label="Data" value={`${account.data_size.toLocaleString()} bytes`} />
          </article>
        ))}
      </div>

      <nav className="flex items-center justify-between pt-3">
        <button
          className="rounded-lg border border-white/10 px-4 py-2 text-sm disabled:opacity-30"
          disabled={page === 0}
          onClick={() => setPage((value) => value - 1)}
          type="button"
        >
          Previous
        </button>
        <span className="text-sm text-slate-500">
          Page {page + 1} of {lastPage + 1}
        </span>
        <button
          className="rounded-lg border border-white/10 px-4 py-2 text-sm disabled:opacity-30"
          disabled={page >= lastPage}
          onClick={() => setPage((value) => value + 1)}
          type="button"
        >
          Next
        </button>
      </nav>
    </section>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-slate-600">{label}</p>
      <p className="mt-1 font-mono text-sm text-slate-200">{value}</p>
    </div>
  )
}

function SetupCard({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-5 text-sm leading-6 text-amber-100">
      {message}
    </div>
  )
}

function shorten(value: string, length: number) {
  return value.length > length * 2 ? `${value.slice(0, length)}...${value.slice(-length)}` : value
}
