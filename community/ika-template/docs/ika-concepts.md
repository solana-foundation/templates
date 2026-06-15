# Ika concepts (for developers)

A short, practical primer on the ideas this template uses.

## What is Ika?

Ika is a **zero-trust threshold-signature network** built on Sui. Its core primitive is the **dWallet**, a programmable signing object whose public key _is_ the address on every supported chain. There's no bridge and no wrapped asset: the dWallet's key signs natively for the target chain.

## The dWallet

A dWallet is not a keypair sitting in a browser or a server. It's an on-chain object (on Sui) representing a key whose signing power is split by MPC. You interact with it through:

- a **dWallet id**, the object's id,
- a **dWallet capability** (`dwallet_cap_id`), which proves the holder may request signatures,
- a **public output**, from which the actual public key (and therefore the chain address) is derived via `publicKeyFromDWalletOutput(curve, output)`.

On the **ED25519** curve, that public key is 32 bytes, exactly a Solana address, and signatures are 64-byte EdDSA, exactly what Solana validates.

## 2PC-MPC: two shares, no whole key

Every signature requires **two principals**:

1. the **user share**, your half, here derived from a `localStorage` seed into `UserShareEncryptionKeys`, and
2. the **network share**, itself a t-of-N threshold MPC across Ika validators.

Neither side can sign alone. Critically, the **full private key is never reconstructed**, not during key generation (DKG), not during signing. That's the zero-trust property: even a compromised client or a minority of validators cannot forge a signature.

## DKG (distributed key generation)

Creating a dWallet runs a DKG protocol between you and the network:

1. `prepareDKGAsync(...)` produces your DKG contribution locally (your message, public output, secret key share, encrypted share).
2. `requestDWalletDKG(...)` submits it on Sui; the network computes its half.
3. Once the dWallet reaches `AwaitingKeyHolderSignature`, you `acceptEncryptedUserShare(...)` to authorize it into `Active`.

The secret key share never leaves your control unencrypted; it's encrypted under your `UserShareEncryptionKeys` before it ever touches the network.

## Presign and sign

Signing is a two-step protocol:

- **Presign**: pre-compute the expensive part of the signature. EdDSA uses a **global** presign (`requestGlobalPresign`), while ECDSA imported keys use `requestPresign`.
- **Sign**: `approveMessage` (authorizes the exact bytes), `verifyPresignCap`, then `requestSign` consuming the presign + the encrypted user share. The network returns the final signature, which you can `parseSignatureFromSignOutput` or read from the completed sign object.

## Why a Sui wallet is involved

Ika runs on Sui, so the DKG/presign/sign round-trips are Sui transactions, and the protocol charges fees in **SUI** (gas) + **IKA** (protocol). This template isolates that into a single backstage **operator** wallet so the main experience stays Solana-first. Fee sizes are roughly `0.5 IKA` + `0.05 SUI` per operation; we attach them with `coinWithBalance` so the SDK auto-selects coins.

## Curves and chains

The same primitive extends across chains by changing the curve:

| Curve     | Signature | Chains                               |
| --------- | --------- | ------------------------------------ |
| ED25519   | EdDSA     | **Solana** (this template), Sui, ... |
| secp256k1 | ECDSA     | Ethereum & EVM, Bitcoin, ...         |

"One key, many chains" is a curve change, not an architecture change. This template stays on ED25519 to keep the Solana story clear; see `extending.md` for the secp256k1 path.

## Further reading

- [dWallets](https://docs.ika.xyz/docs/core-concepts/dwallets) · [2PC-MPC](https://docs.ika.xyz/docs/core-concepts/cryptography/2pc-mpc) · [MPC](https://docs.ika.xyz/docs/core-concepts/cryptography/mpc)
- SDK: [zero-trust dWallet (DKG)](https://docs.ika.xyz/docs/sdk/ika-transaction/zero-trust) · [presign](https://docs.ika.xyz/docs/sdk/ika-transaction/presign) · [user-share encryption keys](https://docs.ika.xyz/docs/sdk/user-share-encryption-keys)
- [Solana integration](https://docs.ika.xyz/docs/solana-integration) · [cryptographic primitives](https://docs.ika.xyz/docs/sdk/cryptographic-primitives)
- [2PC-MPC paper (eprint 2024/253)](https://eprint.iacr.org/2024/253)
- [`@ika.xyz/sdk`](https://www.npmjs.com/package/@ika.xyz/sdk)
