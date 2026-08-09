import { NONCE_TTL_MS } from "./auth";

const issued = new Map<string, number>();

function purgeExpired(now: number) {
  for (const [nonce, expiresAt] of issued) {
    if (expiresAt <= now) issued.delete(nonce);
  }
}

/** Issue a single-use nonce that expires after {@link NONCE_TTL_MS}. */
export function issueNonce(): string {
  const now = Date.now();
  purgeExpired(now);
  const nonce = crypto.randomUUID();
  issued.set(nonce, now + NONCE_TTL_MS);
  return nonce;
}

/**
 * Consume a nonce. Returns true only if it was issued, unexpired, and not
 * already used — deleting it so a proof cannot be replayed.
 */
export function consumeNonce(nonce: string): boolean {
  const now = Date.now();
  purgeExpired(now);
  const expiresAt = issued.get(nonce);
  if (expiresAt === undefined || expiresAt <= now) return false;
  issued.delete(nonce);
  return true;
}
