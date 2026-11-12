# Confidential Chat

A minimal Next.js chat whose messages are encrypted in the browser to a confidential-hardware enclave, after the browser has verified that enclave's attestation. A small server route holds the API key and forwards ciphertext it cannot read, through [Nito](https://docs.trynito.ai) to an enclave running Tinfoil's [published router code](https://github.com/tinfoilsh/confidential-model-router). The whole protocol fits in three short files.

## Quick start

Requires Node.js 24, version 24.22.1 or later.

**1. Create the app**

```shell
npx -y create-solana-dapp@latest -t gh:solana-foundation/templates/community/confidential-chat
```

If the dependencies were not installed for you, run `npm install` in the new folder.

**2. Get a Nito API key**

1. Sign up at [app.trynito.ai/signup](https://app.trynito.ai/signup) with an email address, Google, or X.
2. The API is prepaid, on any plan including Free. Add funds on [Billing](https://app.trynito.ai/billing).
3. Open the Developer Console at [app.trynito.ai/api](https://app.trynito.ai/api), choose **API keys**, then **Create key**. Name it, pick an expiry, and set a spend cap (optional, but do). Nito needs a funded organization and an owner or admin role to create a key.
4. Copy the key. It starts with `z_sk_` and is shown only once.

**3. Paste it**

```shell
cp .env.example .env.local
```

Set `NITO_API_KEY=z_sk_...` in `.env.local`. Only the server reads it.

**4. Run**

```shell
npm run dev
```

**5. Chat**

Open [http://localhost:3000](http://localhost:3000) and send a message. The status line shows each step as it happens. Under each reply, the page shows the enclave it verified: its host, the repository and release tag of its code, and the release digest.

## How it works

```text
browser       1. asks your server for the enclave's attestation
              2. verifies it, then encrypts the chat to the enclave's key
   │
   ▼  ciphertext
your server   adds the API key and forwards the same bytes
   │
   ▼  ciphertext
Nito          relays them to the enclave
   │
   ▼
enclave       decrypts, runs the model, encrypts the reply
   │
   ▼  ciphertext
browser       decrypts the reply
```

Three files hold the protocol:

- [`lib/enclave.ts`](lib/enclave.ts) is the browser's side. `verifyEnclave` checks the attestation bundle with [`@tinfoilsh/verifier`](https://www.npmjs.com/package/@tinfoilsh/verifier), offline, against the repository pinned in that file. If the check fails, nothing is encrypted or sent. `sealedChat` encrypts an OpenAI-style chat request to the verified key with [`ehbp`](https://www.npmjs.com/package/ehbp), sends it, and decrypts the reply.
- [`app/api/attestation/route.ts`](app/api/attestation/route.ts) fetches the current attestation from Nito and returns only the bundle.
- [`app/api/chat/route.ts`](app/api/chat/route.ts) accepts only ciphertext of a bounded size, checks the two headers it forwards, adds the API key and the model header, and passes the encrypted reply back with its response nonce. It never reads or logs the body.

[`app/page.tsx`](app/page.tsx) is the chat screen, and [`lib/model.ts`](lib/model.ts) names the model (GPT-OSS 120B) under the two names Nito and the enclave use for it. The protocol is documented in Nito's [Encrypted Requests](https://docs.trynito.ai/api/api-reference/chat-and-text/encrypted.md) page.

## What this protects and what it does not

- **Protected:** your server and Nito carry the prompts and replies as ciphertext. Neither can read them.
- **Not hidden:** that a message was sent, when, and how large the request and reply were. Your server sees each visitor's IP address. Nito sees the time, the model, your account, and the size of each encrypted request.
- **What you rely on:**
  - The page code you serve. The browser runs whatever your server sends it, including the code that verifies and encrypts. A changed page could send plaintext.
  - The hardware vendor's attestation. The verifier trusts the chip maker's signature on the enclave's report.
  - Tinfoil's published router code. Verification shows the enclave runs a published release of it, not that the release is free of bugs.
  - The attestation is not tied to a fresh challenge. Verification shows the key belongs to a genuine enclave running a published release, not that the attestation was produced just now.
- **The enclave reads the prompt.** It has to, to run the model.

## Before you ship this

This template leaves these out on purpose:

- **Rate limiting and bot protection.** Anyone who can reach `/api/chat` spends your key.
- **Sessions or sign-in**, if only your own users should spend it.
- **A spend cap on the key.** Nito lets you set a daily, monthly, or overall cap when you create a key. Set one.
- **Streaming.** Replies arrive whole.
- **An output-token cap the server can enforce.** The cap (`MAX_COMPLETION_TOKENS` in `lib/enclave.ts`) is inside the encrypted request, so a hostile caller can send any value. The server cannot read the request. Only the byte cap, rate limits, and the key's spend cap bound what a caller can spend.

## If something fails

- **"The server has no API key"**: `NITO_API_KEY` is missing from `.env.local`, or the server started before you set it. Restart `npm run dev`.
- **"Nito answered with an error (HTTP 401)"**: the key is missing, mistyped, expired, or revoked.
- **"Nito answered with an error (HTTP 429)"**: the account has no funds, or you are over a rate limit. See Nito's [Quickstart](https://docs.trynito.ai/api/get-started/quickstart-60-seconds.md).
- **"The enclave failed verification, so nothing was sent"**: the attestation did not verify against the pinned repository. No prompt left the browser.

## Scripts

```shell
npm run dev        # development server
npm run build      # production build
npm run lint       # ESLint
npm run typecheck  # TypeScript
```
