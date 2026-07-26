import { AccountsDashboard } from '@/components/accounts-dashboard'

export default function Home() {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK ?? 'devnet'
  const programId = process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID ?? ''

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 py-10 sm:px-8">
      <header className="mb-10 grid gap-6 border-b border-white/10 pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="eyebrow">Solana + Supabase</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Program accounts, ready to query.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">
            The worker backfills accounts from Solana, follows account changes over WebSockets, and upserts normalized
            rows into Supabase.
          </p>
        </div>
        <div className="status-chip">
          <span className="status-dot" />
          {network}
        </div>
      </header>

      <AccountsDashboard network={network} programId={programId} />
    </main>
  )
}
