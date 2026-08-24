# Eve + Pay.sh Agent

A minimal [Eve](https://eve.dev) agent that inspects an HTTP 402 challenge, shows the payment terms, pauses for approval, and lets [Pay.sh](https://pay.sh) buy a sandbox stock quote.

This template is intentionally small and safe to try:

- Pay.sh uses an ephemeral sandbox account; no mainnet funds or private key are required.
- Eve requires human approval before every payment attempt.
- The tool accepts only 1-5 letter stock tickers and calls a fixed Pay.sh debugger endpoint.
- Eve's general shell, filesystem, and web tools are disabled so the agent cannot bypass the payment tool's approval gate.

## How it works

1. `inspect_stock_quote` requests the resource without payment and parses its HTTP 402 challenge.
2. The agent presents the amount, USDC mint, recipient, and `localnet` network.
3. `buy_stock_quote` pauses at Eve's durable approval gate with those fields visible.
4. After approval, the tool fetches fresh terms and refuses to continue if any approved field changed.
5. Pay.sh creates a sandbox account, signs the local test payment, retries the request, and returns the quote.

## Start locally

Requirements: Node.js 24+, a local sandbox backend supported by Eve (Docker is the easiest option), and a Vercel AI Gateway credential.

```bash
npm install
cp .env.example .env.local
# Add AI_GATEWAY_API_KEY to .env.local
npm run dev
```

Then ask:

```text
Get a paid sandbox quote for AAPL.
```

Eve first displays the payment terms, then pauses. Check the amount, token mint, recipient, and network before approving. Denying the request skips the Pay.sh call.

You can also use Vercel OIDC instead of a local Gateway key:

```bash
vercel link
vercel env pull
```

## Deploy to Vercel

Link the project, add the AI Gateway credential (or use Vercel OIDC), then deploy:

```bash
vercel link
vercel deploy
```

On Vercel, Eve runs the payment command in Vercel Sandbox. The first approved call downloads the pinned Pay.sh CLI into that isolated session, so it may take a little longer.

## Security and permissions

The agent can read payment terms from `debugger.pay.sh` and, only after approval, run the pinned Pay.sh CLI in its isolated Eve sandbox. Pay.sh signs and submits a **sandbox/localnet** transaction using an ephemeral test account. It cannot access a user wallet, seed phrase, or mainnet funds.

Approval is required for every `buy_stock_quote` call. Stop the Eve process or delete the Eve session/sandbox to remove its ephemeral state. There is no persistent wallet authorization to revoke in this starter.

The preflight comparison is a useful teaching pattern, but the HTTP endpoint could still change after that comparison. The consequence here is limited to disposable sandbox funds. Do not treat this template as a production custody design.

## Moving beyond the sandbox

For real payments, replace the CLI-backed demo tool with `@solana/pay-kit/client` and a Solana Keychain signer appropriate to your custody model. Keep all of these boundaries:

- Require approval for every payment, or enforce a separately reviewed spending policy.
- Show and validate recipient, amount, token mint/program, network, and fee payer before signing.
- Enforce maximum amounts and an endpoint allowlist in code.
- Use an idempotency key for paid calls because an interrupted durable step may retry.
- Simulate and confirm settlement on-chain; never trust only a client callback.
- Store signing authority in a KMS, MPC, or other managed signer. Never commit a private key or expose one through a public environment variable.

Read the [Pay.sh client docs](https://pay.sh/docs/get-started/client-quickstart), [Pay Kit TypeScript docs](https://pay.sh/docs/sdk/typescript), and [Eve approval docs](https://eve.dev/docs/human-in-the-loop) before making that change.

## Useful commands

```bash
npm run typecheck
npm run build
npm run format:check
```
