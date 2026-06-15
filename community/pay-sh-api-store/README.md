# Pay.sh API Store

A Next.js template for selling API endpoints through a Pay.sh sandbox gateway.

This template uses a normal Next.js App Router API as the upstream service. Pay.sh runs as a local gateway in front of it, returns HTTP 402 for paid endpoints, verifies the payment proof, then forwards verified traffic to the Next.js API route.

## How It Works

```text
pay client -> Pay.sh gateway on 127.0.0.1:1402 -> Next.js app on localhost:3000
```

1. The Next.js app serves API routes like `/api/insights` and `/api/report`.
2. `pay-provider.yml` defines which routes are exposed and how each paid route is priced.
3. Pay.sh starts a sandbox gateway from that provider spec.
4. A plain request receives `402 Payment Required`.
5. `PAY_API_URL=http://localhost:3000 pay --sandbox curl` handles the payment challenge and retries with a sandbox payment proof.
6. The local balance shim at `/v1/balance/stablecoins` lets the Pay.sh CLI select the Surfpool-funded sandbox USDC challenge without real funds.

## Prerequisites

- Node.js 20 or newer
- pnpm, npm, or yarn
- Pay.sh CLI installed from https://pay.sh/docs/get-started

## Quick Start

Create a project from this template, then run the commands from the generated project directory.

Install dependencies:

```bash
pnpm install
```

Confirm the Pay.sh CLI is installed:

```bash
pay --help
```

If that command fails, install Pay.sh from https://pay.sh/docs/get-started.

Start the Next.js upstream API:

```bash
pnpm dev
```

In another terminal, start the Pay.sh sandbox gateway:

```bash
pnpm gateway
```

This runs `pay --sandbox server start pay-provider.yml --bind 127.0.0.1:1402 --debugger` under the hood.

Call a free endpoint through the gateway:

```bash
curl -i http://127.0.0.1:1402/api/health
```

Verify that a paid endpoint is protected:

```bash
curl -i http://127.0.0.1:1402/api/insights
```

The expected response is `402 Payment Required`. This check does not require wallet funds.

Test the full sandbox paid retry:

```bash
PAY_API_URL=http://localhost:3000 pay --sandbox curl http://127.0.0.1:1402/api/insights
```

This uses the local balance shim while Pay.sh funds the sandbox wallet on Surfpool. No real funds are required.

You can also export the value from `.env.example` in your shell:

```bash
export PAY_API_URL=http://localhost:3000
pay --sandbox curl http://127.0.0.1:1402/api/insights
```

If `PAY_API_URL` is omitted and Pay.sh cannot reach its hosted balance API, the CLI can reject the payment even though Surfpool has funded the wallet.

## Testing Without Funds

This template is designed to run locally without asking users to fund a wallet.

You can test these pieces with no funds:

- Next.js API routes on `localhost:3000`
- Pay.sh sandbox gateway on `127.0.0.1:1402`
- Free endpoint forwarding through `/api/health`
- Paid endpoint gating through a `402 Payment Required` response
- Successful paid retry through `PAY_API_URL=http://localhost:3000 pay --sandbox curl ...`

Pay.sh sandbox mode uses Surfpool localnet. The Pay.sh CLI auto-funds sandbox wallets with localnet SOL and USDC, then uses `PAY_API_URL` to decide which advertised payment challenge the wallet can satisfy. This template points `PAY_API_URL` at a local dev-only balance endpoint so the full paid flow can run without real money.

Check configured accounts:

```bash
pay account list
```

## Endpoint Pricing

| Endpoint        | Price | Purpose                         |
| --------------- | ----- | ------------------------------- |
| `/api/insights` | $0.01 | Paid insight brief              |
| `/api/report`   | $0.02 | Paid usage and revenue report   |
| `/api/health`   | Free  | Gateway and service health test |

## Key Files

| File                                      | Purpose                                     |
| ----------------------------------------- | ------------------------------------------- |
| `pay-provider.yml`                        | Pay.sh gateway routing and pricing config   |
| `src/app/api/insights/route.ts`           | Paid API endpoint returning a JSON brief    |
| `src/app/api/report/route.ts`             | Paid API endpoint returning a JSON report   |
| `src/app/api/health/route.ts`             | Free API endpoint for gateway smoke tests   |
| `src/app/v1/balance/stablecoins/route.ts` | Local Pay.sh balance shim for sandbox tests |
| `.env.example`                            | Local `PAY_API_URL` example for Pay.sh CLI  |
| `src/app/page.tsx`                        | Endpoint pricing table and setup commands   |

## Sandbox, Devnet, And Mainnet

This template is configured for Pay.sh sandbox mode by default.

Sandbox mode uses:

- `pay --sandbox` in CLI commands
- `operator.network: localnet` in `pay-provider.yml`
- An ephemeral local sandbox wallet
- Surfpool-funded localnet SOL and USDC
- `PAY_API_URL=http://localhost:3000` for local balance selection

Use sandbox mode for local development, tests, and demos.

This template does not use Solana devnet by default. Pay.sh provider specs use `localnet` for sandbox testing and `mainnet` for production payments.

Before switching to mainnet, read the Pay.sh provider and security docs:

- https://pay.sh/docs/accept-payments/provider-spec
- https://pay.sh/docs/protocol/security

A production setup usually requires:

- Changing `operator.network` from `localnet` to `mainnet`
- Running Pay.sh without `--sandbox`
- Configuring a real recipient wallet
- Choosing supported currencies
- Setting an RPC URL if needed
- Keeping upstream API credentials in environment variables
- Requiring explicit user approval for real payments

Do not commit private keys, wallet exports, real API tokens, or production secrets to this template.

## Learn More

- Pay.sh docs: https://pay.sh/docs
- Accept payments: https://pay.sh/docs/accept-payments
- Provider specs: https://pay.sh/docs/accept-payments/provider-spec
