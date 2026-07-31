import { createHmac, timingSafeEqual } from "node:crypto";
import {
  address,
  getBase64Decoder,
  getBase64Encoder,
  getCompiledTransactionMessageDecoder,
  getPublicKeyFromAddress,
  verifySignature,
  type Address,
  type ReadonlyUint8Array,
  type SignatureBytes,
} from "@solana/kit";
import { MEMO_PROGRAM_ADDRESS } from "@solana-program/memo";

export const NONCE_TTL_MS = 5 * 60 * 1000;
export const SESSION_COOKIE = "siwhw_session";

/**
 * Resolve the HMAC secret used to sign session tokens. In production the
 * deployment must supply SESSION_SECRET; without it, every session cookie would
 * be signed against a public constant and any attacker could forge one. The
 * insecure fallback exists only for local development. Resolved lazily so that
 * a production build (which runs with NODE_ENV="production") does not throw at
 * import time — the requirement is enforced only when a token is signed or
 * verified at runtime.
 */
function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SESSION_SECRET must be set in production to sign session tokens."
    );
  }
  return "dev-insecure-secret";
}

/**
 * Mint a tamper-evident session token: the address plus an HMAC over it. A
 * client that does not know the session secret cannot forge a token for an
 * address it has not proven ownership of.
 */
export function createSessionToken(addr: string): string {
  const mac = createHmac("sha256", getSessionSecret())
    .update(addr)
    .digest("hex");
  return `${addr}.${mac}`;
}

/** Return the address of a valid session token, or null if it is forged. */
export function readSessionToken(
  token: string | null | undefined
): string | null {
  if (!token) return null;
  const separator = token.lastIndexOf(".");
  if (separator === -1) return null;
  const addr = token.slice(0, separator);
  const mac = token.slice(separator + 1);
  const expected = createHmac("sha256", getSessionSecret())
    .update(addr)
    .digest("hex");
  const macBytes = Buffer.from(mac, "hex");
  const expectedBytes = Buffer.from(expected, "hex");
  if (macBytes.length !== expectedBytes.length) return null;
  if (!timingSafeEqual(macBytes, expectedBytes)) return null;
  return addr;
}

/** Serialize raw bytes to a base64 string for transport across the wire. */
export function bytesToBase64(bytes: ReadonlyUint8Array): string {
  return getBase64Decoder().decode(bytes);
}

/** Parse a base64 string produced by {@link bytesToBase64} back into bytes. */
export function base64ToBytes(value: string): Uint8Array {
  return new Uint8Array(getBase64Encoder().encode(value));
}

export type SignedAuthProof = {
  address: string;
  messageBytesBase64: string;
  signatureBase64: string;
};

export type VerifyResult =
  | { ok: true; address: Address }
  | { ok: false; reason: string };

/**
 * Verify a Sign In With Hardware Wallet proof: an Ed25519 signature over a memo
 * transaction that carries the expected nonce.
 *
 * Hardware wallets cannot sign arbitrary off-chain messages, so the wallet signs
 * a transaction whose only instruction is a memo containing the nonce. The
 * transaction is never broadcast — verification is fully off-chain:
 *
 *  1. the signature is valid Ed25519 over the exact bytes that were signed,
 *  2. those bytes decode to a memo instruction whose text equals the nonce, and
 *  3. the transaction's fee payer is the claimed signer.
 */
export async function verifyAuthProof(
  proof: SignedAuthProof,
  expectedNonce: string
): Promise<VerifyResult> {
  let claimed: Address;
  try {
    claimed = address(proof.address);
  } catch {
    return { ok: false, reason: "Invalid signer address." };
  }

  try {
    const messageBytes = base64ToBytes(proof.messageBytesBase64);
    const signature = base64ToBytes(proof.signatureBase64) as SignatureBytes;

    const publicKey = await getPublicKeyFromAddress(claimed);
    const validSignature = await verifySignature(
      publicKey,
      signature,
      messageBytes
    );
    if (!validSignature) {
      return { ok: false, reason: "Signature does not match the signer." };
    }

    const compiled =
      getCompiledTransactionMessageDecoder().decode(messageBytes);
    if (compiled.version !== "legacy" && compiled.version !== 0) {
      return { ok: false, reason: "Unsupported transaction message version." };
    }

    const { staticAccounts, instructions } = compiled;
    if (staticAccounts[0] !== claimed) {
      return { ok: false, reason: "Fee payer is not the claimed signer." };
    }

    const memo = instructions.find(
      (ix) => staticAccounts[ix.programAddressIndex] === MEMO_PROGRAM_ADDRESS
    );
    if (!memo?.data) {
      return { ok: false, reason: "No memo instruction found." };
    }
    if (new TextDecoder().decode(memo.data) !== expectedNonce) {
      return { ok: false, reason: "Nonce does not match." };
    }

    return { ok: true, address: claimed };
  } catch {
    return { ok: false, reason: "Malformed authentication proof." };
  }
}
