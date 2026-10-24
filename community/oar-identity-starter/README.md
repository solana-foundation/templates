# OAR App Identity Starter

A Next.js starter for Solana apps that want a public, independently verifiable identity: one **OAR App ID** that
ties your app's name to the programs, domain and source repository that actually belong to it.

```bash
npx create-solana-dapp@latest my-app -t gh:solana-foundation/templates/community/oar-identity-starter
cd my-app
npm run dev
```

You can build and run the app without a wallet, an RPC key, or any knowledge of OAR. Identity comes later, when you
are ready.

> **Devnet only.** The OAR registry is deployed on Solana Devnet. Mainnet is **not** available (NO-GO) until an
> independent security review and multisig governance are complete. OAR is an open, permissionless community
> project; it is not a Solana Foundation standard or endorsement.

## What OAR is

Open App Registry (OAR) answers a question wallets and explorers cannot answer from an address alone: _which app is
this program, and who runs it?_

- An **App ID** is a Solana account (a PDA of the OAR registry program) derived from a creator wallet and a nonce.
  It stores the location and SHA-256 hash of your app's **manifest**.
- The **manifest** is a small JSON file you host. It names your app and **claims** the programs, domains and
  repositories it uses.
- A claim only becomes a **link** when the other side agrees: your domain serves a proof file naming the App ID, your
  repository commits one, and your program's upgrade authority writes a backlink onchain.

Anyone can register an App ID. Nobody can make a program, domain or repository point back to it without controlling
that program, domain or repository. That is what makes the links checkable by anyone.

## Registration is not verification

| You see              | It means                                                                                                    |
| -------------------- | ----------------------------------------------------------------------------------------------------------- |
| Registered           | A creator wallet signed an AppRecord. Nothing else.                                                         |
| Linked (verified)    | Both sides point to each other: the manifest claims it and its own proof names this App ID on this cluster. |
| Attested             | No live proof, but an issuer **you chose to trust** attested the link. No issuer is trusted by default.     |
| Unverified           | The proof is missing or incomplete. This is not a statement that the app is unsafe.                         |
| Temporarily unavail. | An RPC, HTTP or DNS check could not finish. Retry; it is never a failure.                                   |
| Disputed / invalid   | Evidence that was read contradicts the claim (it names another App ID or cluster).                          |

None of these states is a security audit or an endorsement. Do not call your app "verified" because you generated
files or registered a record.

## Project layout

| Path                                 | What it is                                                                       |
| ------------------------------------ | -------------------------------------------------------------------------------- |
| `src/app/page.tsx`                   | Your app. Start here.                                                            |
| `oar.config.json`                    | Your identity inputs: name, domain, repositories, deployed program IDs, nonce.   |
| `scripts/prepare-oar.mjs`            | `npm run oar:prepare`: derives the App ID and writes the manifest and proofs.    |
| `scripts/import-anchor-programs.mjs` | `npm run oar:anchor`: copies `[programs.devnet]` IDs from an Anchor workspace.   |
| `src/lib/oar.ts`                     | Server-only helper that resolves a program's verified identity with the OAR SDK. |

## 1. Build and run

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run build
```

Nothing here needs a wallet. The page reminds visitors that the app is "not registered" until you finish the steps
below.

## 2. Configure your domain and repository

Edit `oar.config.json`:

```json
{
  "standard": "0.1",
  "cluster": "solana:devnet",
  "name": "My App",
  "summary": "One sentence, up to 140 characters",
  "category": "defi",
  "domain": "myapp.xyz",
  "repositories": ["https://github.com/me/my-app"],
  "programs": [],
  "nonce": 0
}
```

Only list a domain, repository or program you control. `domain` may stay empty during local development, but
`oar:prepare` refuses to run until you set a domain or a `manifestUri`.

If you have an Anchor workspace with deployed Devnet programs, import their **public** IDs:

```bash
npm run oar:anchor -- --workspace ../my-anchor-project        # preview only
npm run oar:anchor -- --workspace ../my-anchor-project --yes  # update oar.config.json
```

It reads `[programs.devnet]` from `Anchor.toml` and never reads keypair files. A program ID in the config is a claim,
not proof of ownership.

## 3. Derive your App ID and prepare the proofs

Choose the **public** address of the creator wallet. It determines your App ID permanently (with the nonce). Never
paste a private key or seed phrase anywhere in this project.

```bash
npm run oar:prepare -- --creator YOUR_PUBLIC_WALLET_ADDRESS
```

This runs offline. It sends no transaction and signs nothing. It prints the App ID and the manifest's RFC 8785
SHA-256, and writes:

| File                                   | Where it must be served                                           |
| -------------------------------------- | ----------------------------------------------------------------- |
| `public/.well-known/oar-manifest.json` | The manifest, at `https://<domain>/.well-known/oar-manifest.json` |
| `public/.well-known/oar.json`          | Domain proof, at `https://<domain>/.well-known/oar.json`          |
| `oar.json`                             | Repository proof, committed at the root of the default branch     |

The manifest and the proofs are always separate files; the name `oar.json` is reserved for proofs. If you host the
manifest elsewhere, set `manifestUri` to an immutable location: `ar://`, `ipfs://`, or a raw GitHub/GitLab URL that
names a full commit SHA. Branch, tag and `HEAD` URLs are refused because the onchain hash would stop matching when
the branch moves.

If the creator already used nonce 0, pass `--nonce 1` (or set `nonce` in the config). Existing files are never
overwritten unless you pass `--force`.

## 4. Publish the proofs

1. Deploy the site so both `/.well-known/` files return HTTP 200 over HTTPS **without redirects**. (Next.js serves
   `public/` as-is.) A DNS TXT record `_oar.<domain>` = `oar=solana:devnet:<APP_ID>` also works for the domain.
2. Commit `oar.json` to the default branch of every listed repository.

## 5. Register on Devnet (explicit wallet approval)

Open https://oarprotocol.xyz/register, connect the **same creator wallet**, and follow the steps. The page fetches
your hosted manifest, checks it matches the hash you are committing, and shows a plain-language summary before your
wallet asks you to sign. Only you sign; no key is given to OAR or to this app. Developers with their own secured
local signer can use the OAR CLI instead (`oar claim register`, see the
[registration guide](https://github.com/gwapupward-hub/oar/blob/main/docs/REGISTERING.md)).

## 6. Link a program (upgrade-authority backlink)

A program link needs a second signature from the program's **upgrade authority**: it writes a canonical
[Program Metadata](https://github.com/solana-program/program-metadata) account (seed `oar`) naming your App ID.
Only the upgrade authority can create that canonical account, which is why the backlink proves control. Use the
registration page or `oar claim link-program <PROGRAM_ID>`; for a Squads-held authority, `--squads` prints an unsigned
proposal instead of signing. An immutable program (no upgrade authority) cannot publish a backlink and can only be
attested by an issuer.

## 7. Inspect the verification states

- Explorer: `https://oarprotocol.xyz/app/<APP_ID>` and `https://oarprotocol.xyz/program/<PROGRAM_ID>`.
- In code, `getProgramIdentity(programId)` from `src/lib/oar.ts` (server components or route handlers only) returns:
  - `verified`: both sides agree. Only then show the app name as the program's publisher.
  - `unverified`: no matching proof. Not a statement that the program is unsafe.
  - `unavailable`: the RPC read failed. Show a retry, never a failure.

In production, set the server-side `OAR_DEVNET_RPC_URL` to a dedicated HTTPS Devnet RPC. Do not put an
API-key-bearing URL in a `NEXT_PUBLIC_` variable.

## Security boundaries

- No private keys, keypair files or seed phrases are read, generated or stored. `.gitignore` excludes
  `*-keypair.json` and `id.json`.
- No script submits a transaction or signs anything. Registration and program linking always require your own wallet's
  explicit approval, outside this template.
- No issuer is trusted by default, so nothing is shown as `attested` unless you configure it.
- `oar:prepare` and `oar:anchor` only write local files, and refuse to overwrite them without `--force` / `--yes`.

## Current limitations

- Devnet only; mainnet is NO-GO.
- The OAR SDK is installed from npm, pinned to `@open-app-registry/sdk@0.1.1-rc.3`.
- Domain proofs must be served without redirects; repository proofs are read from the default branch of GitHub or
  GitLab only.
- A deployed program is linked separately by its upgrade authority; this template does not deploy programs.

## Learn more

- Protocol, SDK and CLI: https://github.com/gwapupward-hub/oar
- Explorer and registration: https://oarprotocol.xyz ([source](https://github.com/gwapupward-hub/oar-web))
- Specification: https://github.com/gwapupward-hub/oar/blob/main/docs/spec-v0.1.md
