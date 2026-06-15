# Extending this template

You cloned it. Here's how to take it past the teaching demo.

## 1. Sign for other chains (secp256k1)

The biggest payoff of dWallets is "one key, many chains." Switching the curve is most of the work:

- In `src/lib/ika.ts`, change `CURVE` to `Curve.SECP256K1`, `SIGNATURE_ALGORITHM` to `SignatureAlgorithm.ECDSASecp256k1`, and `HASH` to a valid ECDSA hash (`Hash.KECCAK256` for Ethereum, `Hash.SHA256` for Bitcoin-style).
- ECDSA dWallets use the per-dWallet `requestPresign` (not `requestGlobalPresign`).
- Derive the chain address from the public key: secp256k1 → keccak256 → last 20 bytes for an Ethereum address; or the appropriate hash for a Bitcoin address.
- Build and broadcast the target-chain transaction with that chain's tooling (ethers/viem for EVM, etc.), splicing in the signature.

The DKG/accept/verify shape stays the same. Only the curve, hashing, presign call, and the target-chain tx assembly change. See the `@ika.xyz/sdk` integration tests for ECDSA combinations.

## 2. Go to mainnet (carefully)

- Set `VITE_IKA_NETWORK=mainnet` (resolves Ika mainnet package/object ids via `getNetworkConfig`).
- Point `VITE_SOLANA_RPC_URL` at a mainnet RPC and use a real Sui mainnet RPC.
- **Re-audit everything below.** Mainnet means real funds and a real adversary. Do not ship the `localStorage` user-share pattern or the single-operator fee model to mainnet without redesign.

## 3. Replace `localStorage` for the user share

The user-share seed in `src/lib/session.ts` is the user's half of the 2PC-MPC key. In production you want it durable, encrypted, and recoverable:

- Encrypt the seed with a passphrase or a passkey-derived key before storing.
- Or back the share with a secure enclave / hardware-backed key store.
- Consider social/quorum recovery so a lost browser isn't a lost wallet. (See [ikavery](https://github.com/Iamknownasfesal/ikavery) and `clear-msig-ika` for recovery and multisig patterns built on the same primitive.)

`UserShareEncryptionKeys` already serializes via `toShareEncryptionKeysBytes()` / restores via `fromShareEncryptionKeysBytes()`, so you can persist the derived keys wherever you store secrets. Just protect them.

## 4. Harden the operator / fee model

A single Sui wallet paying every fee is a demo convenience. For production:

- Use a sponsored-transaction / relayer pattern so the end user never needs SUI/IKA directly.
- Meter and rate-limit fee spending.
- Separate the fee payer (sponsor) from the transaction sender if your Move logic checks `ctx.sender()`. (`@mysten/sui` supports gas sponsorship; ikavery's `executor.ts` shows a sponsored-executor pattern.)

## 5. Persist more than `localStorage`

`src/lib/dwallets.ts` keeps a `localStorage` list of created dWallets. Swap it for a real backend or indexed storage if you need multi-device access or history. The dWallet itself lives on-chain; you're only caching its ids + Solana address.

## 6. Production checklists

- Verify signatures **before** broadcasting (this template does, via `@noble/curves`) and again handle on-chain failures gracefully.
- Treat the dWallet's public output as authoritative for the address; don't trust a cached value blindly across reconfigurations.
- Add observability around the DKG/presign/sign polling so a slow network never looks like an app bug.
