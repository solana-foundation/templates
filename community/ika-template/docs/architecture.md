# Architecture

This template wires three chains/roles together so a single MPC-controlled key can act as a Solana account.

## The pieces

| Piece                     | File                         | Responsibility                                                                  |
| ------------------------- | ---------------------------- | ------------------------------------------------------------------------------- |
| Ika flow                  | `src/lib/ika.ts`             | DKG, global presign, sign, all on ED25519 / EdDSA / SHA512 via `@ika.xyz/sdk`.  |
| Solana helpers            | `src/lib/solana.ts`          | Devnet connection, airdrop, build transfer, splice signature, broadcast.        |
| Sui helpers               | `src/lib/sui.ts`             | Sui client, IKA coin type, fee coins, operator balances, faucet.                |
| User-share identity       | `src/lib/session.ts`         | The local ED25519 `UserShareEncryptionKeys` derived from a `localStorage` seed. |
| dWallet registry          | `src/lib/dwallets.ts`        | `localStorage` list of created dWallets (ids + Solana address).                 |
| Local verification        | `src/lib/verify.ts`          | `@noble/curves` ed25519 verify (what a Solana validator does).                  |
| Solana wallet connector   | `src/lib/solana-wallet.tsx`  | Minimal Wallet-Standard connector for Phantom (the human's wallet).             |
| Operator execution bridge | `src/lib/use-execute-sui.ts` | Turns dapp-kit signing into the `ExecuteSui` callback `lib/ika.ts` expects.     |

## The three actors

```
  ┌──────────────┐        ┌─────────────────────────┐        ┌──────────────┐
  │ Phantom      │        │  The dWallet            │        │ Sui operator │
  │ (Solana)     │        │  (MPC Solana account)   │        │ (backstage)  │
  │              │        │                         │        │              │
  │ your wallet, │  recv  │ ED25519 pubkey == a     │  fees  │ pays SUI gas │
  │ fund dest.   │◀───────│ Solana address; signs   │◀───────│ + IKA per op │
  └──────────────┘        │ via 2PC-MPC             │        └──────────────┘
                          └───────────┬─────────────┘
                                      │ your half of the key:
                              ┌───────▼─────────┐
                              │ user share      │ (localStorage seed →
                              │ (this browser)  │  UserShareEncryptionKeys)
                              └─────────────────┘
```

## dWallet lifecycle

```
CREATE (/create)
  prepareDKGAsync(curve=ED25519)         ── local crypto: your DKG contribution
        │
        ▼
  requestDWalletDKG  ── Sui tx #1 ──▶ operator signs + pays (IKA + SUI)
        │
        ▼
  [Ika network does its half of the DKG]
        │
        ▼
  acceptEncryptedUserShare ── Sui tx #2 ──▶ operator signs ──▶ dWallet = Active
        │
        ▼
  publicKeyFromDWalletOutput(ED25519) ──▶ 32-byte pubkey ──▶ base58 ──▶ Solana address


SIGN & SEND (/sign)
  buildDWalletTransfer ── Solana MessageV0 (dWallet = signer + fee payer)
        │
        ▼
  requestGlobalPresign(EdDSA) ── Sui tx ──▶ operator pays ──▶ wait Completed
        │
        ▼
  approveMessage + verifyPresignCap + requestSign ── Sui tx ──▶ operator pays
        │
        ▼
  parse 64-byte EdDSA signature  ──▶  verify locally (@noble/curves)
        │
        ▼
  addSignature + sendRawTransaction ──▶ Solana devnet ──▶ explorer link
```

## Why two on-chain transactions for DKG?

DKG is a round-trip: you submit your contribution, the Ika network computes its share and reaches `AwaitingKeyHolderSignature`, and then you must _accept_ your encrypted user share to authorize the dWallet into `Active`. That acceptance is a second Sui transaction. We poll `getDWalletInParticularState(...)` between them.

## Signing: why a global presign?

For EdDSA (and other Schnorr-family schemes) Ika uses a **global** presign (`requestGlobalPresign`) rather than the per-dWallet `requestPresign` used by ECDSA imported keys. The presign is requested, polled to `Completed`, then consumed by `requestSign` alongside the message approval and the encrypted user share.

## What the operator never does

The Sui operator wallet only pays fees and signs the Ika coordination transactions. It does **not** control the dWallet, hold the user share, or touch your Solana funds. Authority over the dWallet comes from the 2PC-MPC pair: the Ika network share plus your local user share.
