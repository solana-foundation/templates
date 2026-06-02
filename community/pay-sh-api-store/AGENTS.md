# Pay.sh API Store, agent guide

This template sells API endpoints. A normal Next.js App Router service is the upstream API, and a Pay.sh gateway sits in front of it to charge per call. Paid routes return HTTP 402 until a valid payment proof is attached, then the gateway forwards the request to Next.js.

Everything here runs locally in sandbox mode with no real money. Pay.sh funds an ephemeral wallet on a Surfpool localnet and pays with sandbox USDC.

## Request flow

```text
caller -> Pay.sh gateway (127.0.0.1:1402) -> Next.js app (localhost:3000)
```

1. The caller hits a paid route on the gateway.
2. The gateway answers `402 Payment Required` with a payment challenge.
3. The Pay.sh client signs a payment and retries with an `Authorization: Payment ...` header.
4. The gateway verifies the proof on-chain, then proxies the request to Next.js and returns the JSON.

## Run it

You need two long-running processes, so start each in its own background process or terminal. The Pay.sh CLI must be on PATH (`pay --help` to check, install from https://pay.sh/docs/get-started).

```bash
# 1. upstream API
pnpm dev                                  # serves localhost:3000

# 2. sandbox gateway (reads pay-provider.yml from the project root)
pay --sandbox server start pay-provider.yml --bind 127.0.0.1:1402 --debugger
```

Wait until `curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:1402/api/health` returns `200` before making paid calls.

## Call the endpoints

Free route, plain request:

```bash
curl -i http://127.0.0.1:1402/api/health        # -> 200
```

Paid route without payment, to confirm gating:

```bash
curl -i http://127.0.0.1:1402/api/insights       # -> 402 Payment Required
```

Paid route with payment. `PAY_API_URL` must point at the Next.js app so the CLI can read the local balance shim and pick the funded sandbox USDC challenge:

```bash
PAY_API_URL=http://localhost:3000 pay --sandbox curl http://127.0.0.1:1402/api/insights
PAY_API_URL=http://localhost:3000 pay --sandbox curl http://127.0.0.1:1402/api/report
```

A successful paid call returns `200` with the JSON body and a `payment-receipt` header containing the on-chain transaction signature. If `PAY_API_URL` is omitted, the CLI may reject the payment even though the sandbox wallet is funded.

Check the sandbox wallet with `pay --sandbox account list`.

## Endpoints

| Method | Path            | Price | Returns                                               |
| ------ | --------------- | ----- | ----------------------------------------------------- |
| GET    | `/api/insights` | $0.01 | Signal, confidence, and a recommended next action     |
| GET    | `/api/report`   | $0.02 | Usage totals, paid requests, revenue, and p95 latency |
| GET    | `/api/health`   | Free  | Service health, used for smoke tests                  |

Pricing and routing live in `pay-provider.yml`. Each endpoint there maps to one row above.

## Key files

| File                                      | Purpose                                                |
| ----------------------------------------- | ------------------------------------------------------ |
| `pay-provider.yml`                        | Gateway routing, network, and per-route pricing        |
| `src/app/api/insights/route.ts`           | Paid endpoint, returns the insight brief               |
| `src/app/api/report/route.ts`             | Paid endpoint, returns the usage report                |
| `src/app/api/health/route.ts`             | Free endpoint                                          |
| `src/app/v1/balance/stablecoins/route.ts` | Local balance shim that funds sandbox USDC for the CLI |
| `src/app/page.tsx`                        | Landing page with the run steps and pricing table      |
| `.env.example`                            | `PAY_API_URL` for local sandbox calls                  |

## Adding a paid endpoint

1. Add a route handler under `src/app/api/<name>/route.ts` that returns JSON.
2. Add a matching entry to `pay-provider.yml` under `endpoints` with a `metering.tiers` price.
3. Restart the gateway so it reloads `pay-provider.yml`.

## Sandbox vs mainnet

This template is sandbox only by default (`pay --sandbox`, `operator.network: localnet`, the local balance shim). Do not treat it as production. Before going to mainnet, read https://pay.sh/docs/accept-payments/provider-spec and https://pay.sh/docs/protocol/security, switch `operator.network` to `mainnet`, drop `--sandbox`, set a real recipient wallet, and require explicit user approval before any real payment. Never commit private keys, wallet exports, or real API tokens.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->
