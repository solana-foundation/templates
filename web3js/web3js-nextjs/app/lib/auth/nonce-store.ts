import { randomBytes } from "node:crypto";

export const NONCE_TTL_MS = 5 * 60 * 1000;
const MAX_NONCES = 10_000;

// In-memory and per-process: fine for a single dev server, but nonces are lost
// on restart and not shared between instances. Use a shared store (Redis, a
// database table) with an atomic "consume" in production. Kept on globalThis
// so every route bundle and dev hot reload sees the same map.
const globalStore = globalThis as { __siwsNonces?: Map<string, number> };
const nonces = (globalStore.__siwsNonces ??= new Map<string, number>());

export function issueNonce(now = Date.now()): string {
  for (const [nonce, expiresAt] of nonces) {
    if (expiresAt <= now) nonces.delete(nonce);
  }
  while (nonces.size >= MAX_NONCES) {
    nonces.delete(nonces.keys().next().value!);
  }

  const nonce = randomBytes(16).toString("hex");
  nonces.set(nonce, now + NONCE_TTL_MS);
  return nonce;
}

export function consumeNonce(nonce: string, now = Date.now()): boolean {
  const expiresAt = nonces.get(nonce);
  nonces.delete(nonce);
  return expiresAt !== undefined && expiresAt > now;
}
