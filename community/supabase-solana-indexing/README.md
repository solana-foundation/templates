# Supabase + Solana Indexing

A production-minded starter for indexing accounts owned by a Solana program into Supabase. It combines a one-time `getProgramAccounts` backfill with live `programSubscribe` updates, retry and gap recovery, SQL indexes, Realtime updates, and a paginated Next.js dashboard.

## Architecture

1. `scripts/indexer.ts` opens a WebSocket program subscription, then fetches every account currently owned by your configured program.
2. Rows are normalized and upserted into `indexed_program_accounts` in bounded batches, and rows absent from the snapshot are removed.
3. Notifications queued during the snapshot are applied afterward, closing the startup and reconnect gaps.
4. Live zero-lamport notifications remove closed accounts, and failures or the periodic reconciliation interval restart the subscribe-then-backfill cycle.
5. The browser queries an RLS-protected read view that casts Solana u64 fields to exact text while retaining a numeric helper for indexed filtering.

The Supabase service-role key is used only by the Node.js worker. Never put it in a `NEXT_PUBLIC_*` variable or browser code.

## Quickstart

### 1. Install

```bash
npm install
cp .env.example .env.local
```

### 2. Create the database

Create a Supabase project, open its SQL editor, and run:

```text
supabase/migrations/20260715000000_create_program_accounts.sql
```

The migration creates the table and query indexes, enables RLS with public read-only access, and registers the table with Supabase Realtime.

### 3. Configure the worker

Fill in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Project API settings. The anon key is safe to use in a browser when RLS is enabled.
- `SUPABASE_SERVICE_ROLE_KEY`: Server-only worker credential. It bypasses RLS and must remain secret.
- `NEXT_PUBLIC_SOLANA_PROGRAM_ID`: The deployed program whose owned accounts you want to index.
- `SOLANA_RPC_URL` and `SOLANA_WS_URL`: Matching HTTP and WebSocket endpoints for the selected network.

Public RPC endpoints are useful for a small demo, but providers may limit `getProgramAccounts`, response size, or WebSocket connections. Use a dedicated RPC for large programs.

### 4. Start indexing

```bash
npm run indexer
```

Keep the worker running. In a second terminal:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Query examples

The dashboard in `components/accounts-dashboard.tsx` demonstrates:

- program and network filtering with `.eq()`;
- case-sensitive address-prefix filtering with `.like()`;
- minimum-balance filtering with `.gte()`;
- newest-first sorting with `.order()`;
- count-aware pagination with `.range()`;
- Realtime `postgres_changes` subscriptions.

Example server-side query:

```ts
const { data, count } = await supabase
  .from('indexed_program_accounts_read')
  .select('account_address, lamports, data_base64, slot', { count: 'exact' })
  .eq('network', 'devnet')
  .eq('program_id', programId)
  .gte('lamports_numeric', '1000000')
  .order('updated_at', { ascending: false })
  .range(0, 49)
```

## Transforming account data

The generic worker stores account data as base64 because every Solana program defines a different binary layout. For your program, add a decoder inside `normalizeAccount()` and add typed columns in the SQL migration. Keep the raw base64 field during development so decoder changes can be replayed without re-fetching old account versions.

For Anchor programs, compare the account discriminator before decoding. For generated Kit clients, prefer the generated account decoder rather than maintaining offsets by hand.

## Performance notes

- Keep the composite primary key so repeated backfills are idempotent.
- Tune `INDEXER_BATCH_SIZE` for your Supabase plan and row size.
- Tune `INDEXER_RECONCILE_INTERVAL_MS` to trade RPC snapshot cost for faster cleanup of accounts that change owner without a matching notification.
- Keep filters aligned with the included indexes. Add application-specific indexes for decoded columns.
- Avoid querying unbounded account data in the browser; select only required fields for production views.
- For very large programs, split backfills with RPC `dataSlice`/filters or use a provider with historical streaming rather than repeatedly fetching the entire program.

## Reliability and security

- The worker retries Solana reads and Supabase writes with exponential backoff and jitter.
- The worker subscribes before each backfill so changes during the snapshot are queued, then reconciles rows missing from the snapshot.
- A database trigger rejects updates from slots older than the stored row, protecting restarts and concurrent workers from RPC lag.
- The public read view returns lamports, rent epochs, and slots as text so JavaScript never rounds Solana u64 values; numeric filtering remains server-side.
- Closed zero-lamport accounts are removed instead of remaining as stale query results.
- Anonymous users receive `SELECT` only. Writes use the service role and bypass RLS.
- `.env*`, logs, and local dependency artifacts are ignored.
- Rotate the service-role key immediately if it is ever exposed.

## Validation

```bash
npm run ci
```

### Live integration test

Use a disposable Supabase project with the migration applied, then configure
`.env.local`. For a small devnet fixture, the repository's counter program can
be used as `NEXT_PUBLIC_SOLANA_PROGRAM_ID`:

```text
Count3AcZucFDPSFBAeHkQ6AvttieKUkyJ8HiQGhQwe
```

Run the opt-in test:

```bash
npm run test:live
```

The test starts the real indexer and verifies a non-empty backfill, the Solana
WebSocket subscription, service-role writes, anonymous reads, blocked anonymous
writes, and Supabase Realtime delivery. It does not submit Solana transactions.
The indexed rows remain in the disposable project so you can inspect them in the
dashboard afterward.

For an opt-in assertion of the complete Solana-to-Supabase update path, set
`LIVE_TEST_REQUIRE_SOLANA_UPDATE=true` before starting the test. When it prints
that it is waiting for an account change, submit a devnet transaction that
changes one of the indexed accounts (for example, transfer one lamport to it).
The test passes only after it observes a database row with a slot newer than the
backfill snapshot.

To verify scaffolding from the repository:

```bash
npx -y create-solana-dapp@latest my-indexer -t gh:solana-foundation/templates/community/supabase-solana-indexing
```

After the template is merged and published, scaffold it by name:

```bash
npx -y create-solana-dapp@latest my-indexer --template supabase-solana-indexing
```

## References

- [Solana `getProgramAccounts`](https://solana.com/docs/rpc/http/getprogramaccounts)
- [Solana `programSubscribe`](https://solana.com/docs/rpc/websocket/programsubscribe)
- [Solana Kit](https://www.solanakit.com/)
- [Supabase JavaScript client](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime/postgres-changes)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
