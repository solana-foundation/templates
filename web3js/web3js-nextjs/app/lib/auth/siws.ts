import {
  verifySignIn,
  type SolanaSignInInput,
  type SolanaSignInOutput,
} from "@solana/wallet-adapter/core";

export const ISSUED_AT_MAX_AGE_MS = 5 * 60 * 1000;
export const MAX_CLOCK_SKEW_MS = 60 * 1000;

export type VerifySignInRequest = {
  input: SolanaSignInInput;
  output: SolanaSignInOutput;
  expectedDomain: string;
  consumeNonce: (nonce: string) => boolean;
  now?: number;
};

type VerifySignInSuccess = { ok: true; address: string };
type VerifySignInFailure = { ok: false; error: string };
export type VerifySignInResult = VerifySignInSuccess | VerifySignInFailure;

/**
 * Server-side Sign In With Solana check. `verifySignIn` proves the signed
 * message reproduces `input`, names the requested account, and carries a valid
 * signature from that account, for both plain-text and version 1 off-chain
 * message sign-ins. The checks around it decide whether this server accepts
 * that message: right domain, fresh timestamp, and a nonce it issued that has
 * not been used yet.
 */
export async function verifySignInRequest({
  input,
  output,
  expectedDomain,
  consumeNonce,
  now = Date.now(),
}: VerifySignInRequest): Promise<VerifySignInResult> {
  if (input.domain !== expectedDomain) {
    return fail("Sign-in message was created for a different domain");
  }

  const issuedAt = Date.parse(input.issuedAt ?? "");
  if (
    Number.isNaN(issuedAt) ||
    now - issuedAt > ISSUED_AT_MAX_AGE_MS ||
    issuedAt - now > MAX_CLOCK_SKEW_MS
  ) {
    return fail("Sign-in message is missing a recent issuedAt");
  }
  if (input.expirationTime && !(Date.parse(input.expirationTime) > now)) {
    return fail("Sign-in message has expired");
  }
  if (input.notBefore && !(Date.parse(input.notBefore) <= now)) {
    return fail("Sign-in message is not valid yet");
  }

  if (!(await verifySignInSafely(input, output))) {
    return fail("Sign-in signature is invalid");
  }
  if (!input.nonce || !consumeNonce(input.nonce)) {
    return fail("Nonce is unknown, expired, or already used");
  }

  return { ok: true, address: output.account.address };
}

// The plain-text verifier throws on malformed bytes instead of returning false.
async function verifySignInSafely(
  input: SolanaSignInInput,
  output: SolanaSignInOutput
) {
  try {
    return await verifySignIn(input, output);
  } catch {
    return false;
  }
}

function fail(error: string): VerifySignInResult {
  return { ok: false, error };
}
