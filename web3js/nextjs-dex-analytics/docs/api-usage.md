## API Usage, Caching, and Rate Estimates (concise)

Assumptions

- Per edge region figures (Vercel cache TTLs apply per region).
- “Calls” below are network requests to the external provider after Next.js/Vercel caching. Client polls shown only insofar as they cause origin misses.

### External providers and where we call them

- Helius RPC: `getRecentPerformanceSamples` (tps) in `app/api/stats/route.ts` (no-store)
- DeFi Llama (coins.llama.fi): current/historical prices in `app/api/stats/route.ts`; batchHistorical in `app/api/trending/route.ts` via `lib/defillama.ts`
- DeFi Llama (api.llama.fi): chains, overview, historical TVL/DEX charts in `app/api/stats/route.ts` and `app/api/dex/**`
- Jupiter Ultra API: holdings, order, execute in `lib/jupiter-ultra.ts` via `components/swap-interface.tsx` (user-driven)
- Jupiter Price API (price.jup.ag): not on hot paths currently (in `lib/helius.ts` only)

### Caching behavior (key TTLs)

- `app/api/stats`: `Cache-Control: s-maxage=3, stale-while-revalidate=15`; internal fetches: Helius RPC no-store; DeFi Llama revalidate 15/120/300/600s
- `app/api/trending`: `s-maxage=300, stale-while-revalidate=300`; internal fetch: coins.llama revalidate 60s
- `app/api/dex/overview`: `s-maxage=600, stale-while-revalidate=3600`; internal fetches revalidate 600s and 900s
- `app/api/dex/protocol/[slug]`: `s-maxage=600, stale-while-revalidate=3600`; internal fetch revalidate 600s

### Estimated call volume per edge region

(Minute → Hour → Day → 30-day month)

- Helius RPC (tps; no-store)
  - Driven by `StatsBar` polling /api/stats every 3s; CDN TTL=3s → 1 origin miss per 3s
  - ≈ 20/min → 1,200/hr → 28,800/day → 864,000/month

- DeFi Llama (coins.llama.fi)
  - Current SOL price (revalidate 15s): ≈ 4/min → 240/hr → 5,760/day → 172,800/month
  - Historical SOL t-24h (revalidate 600s): ≈ 0.1/min → 6/hr → 144/day → 4,320/month
  - Trending (batchHistorical) for 24h and 7d (2 variants; route TTL 300s, inner revalidate 60s): ≈ 0.4/min → 24/hr → 576/day → 17,280/month

- DeFi Llama (api.llama.fi)
  - `v2/chains` (revalidate 300s): ≈ 0.2/min → 12/hr → 288/day → 8,640/month
  - `overview/dexs?chain=Solana&excludeTotalDataChart=true` (revalidate 120s): ≈ 0.5/min → 30/hr → 720/day → 21,600/month
  - `v2/historicalChainTvl/Solana` (revalidate 600s): ≈ 0.1/min → 6/hr → 144/day → 4,320/month
  - `overview/dexs?...excludeTotalDataChart=false` (stats volume history; revalidate 600s): ≈ 0.1/min → 6/hr → 144/day → 4,320/month
  - `overview/dexs?excludeTotalDataChart=false` (dex overview; revalidate 600s): ≈ 0.1/min → 6/hr → 144/day → 4,320/month
  - `summary/dexs/[slug]` (protocol page; revalidate 600s): ≈ 0.1/min per active slug → 6/hr → 144/day → 4,320/month per slug

- Jupiter Ultra (user-driven; no periodic polling)
  - `GET /holdings/{address}`: on connect and after swap; typical session: ~1–3 calls
  - `GET /order?…` (quotes): on amount/token changes; recommend debounced ≤2 req/s per user
  - `POST /execute`: 1 per swap

Notes

- All figures are per edge region. Multiple regions and high concurrency increase totals proportionally.
- Client poll volume is higher than origin volume due to CDN s-maxage; above counts are post-cache external calls.

### Free-tier sanity (estimates, verify with providers)

- Helius RPC: baseline ≈ 0.33 rps/region (20/min). Monthly ≈ 0.86M calls/region. Usually under typical free rps, but verify your plan.
- DeFi Llama: public endpoints; our aggregate ≈ 5.6/min baseline from stats + trending + dex overview (~0.093 rps). Well within fair use; avoid spikes >>1 rps.
- Jupiter Ultra: user-driven; keep quotes ≤2 rps per user with debounce.

### Quick wins (low complexity, high impact)

- Stats load
  - Increase `/api/stats` CDN TTL to 5–10s if acceptable (cuts Helius RPC by 33–70%).
  - Optionally compute TPS via a lightweight scheduled job (cron) every 5–10s and serve cached value to eliminate RPC per-request.
- Quotes load
  - Debounce `getJupiterOrder` by 300–500ms and cancel in-flight on new input; cap at ≤2 rps per user.
  - Only refetch on meaningful changes (amount changes ≥0.5–1.0% or token change).
- Trending/Dex
  - Keep current TTLs (5–15 min). Tag cache keys and reuse across routes when URLs match.
- Client caching
  - Use SWR/React Query for `/api/trending` and `/api/dex/*` with `dedupingInterval` ≥ 30–60s and `staleTime` aligned to route TTL.
- Rate limiting (abuse safety)
  - Add per-IP/user limiter on user-triggered endpoints (e.g., Upstash/Redis Ratelimit) at modest thresholds (e.g., 10 req/10s burst 20).

### Action checklist

- [ ] Debounce quotes to 300–500ms; cancel stale; ≤2 rps/user
- [ ] Consider `/api/stats` TTL 5–10s (reduce Helius load)
- [ ] (Optional) Move TPS to cron-backed cache
- [ ] Add SWR to client pages calling `/api/trending` and `/api/dex/*`
- [ ] Add lightweight rate limiter for user-triggered endpoints
