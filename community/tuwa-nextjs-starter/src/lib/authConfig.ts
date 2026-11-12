import crypto from 'crypto';

/**
 * Resolves the signing secret for the stateless demo profile.
 * - In production: strictly fail closed if SIWX_DEMO_SIGNING_SECRET is missing or < 32 chars.
 * - In development: fallback to an ephemeral in-memory random 32-byte secret per server process.
 */
function resolveDemoSigningSecret(): string {
  const envSecret = process.env.SIWX_DEMO_SIGNING_SECRET;
  if (envSecret && envSecret.length >= 32) {
    return envSecret;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      '[SIWX Auth] SIWX_DEMO_SIGNING_SECRET environment variable is missing or shorter than 32 characters in production.',
    );
  }

  const globalWithSecret = globalThis as typeof globalThis & { __ephemeralSiwxSecret?: string };
  if (!globalWithSecret.__ephemeralSiwxSecret) {
    globalWithSecret.__ephemeralSiwxSecret = crypto.randomBytes(32).toString('hex');
  }

  return globalWithSecret.__ephemeralSiwxSecret;
}

export const DEMO_SIGNING_SECRET = resolveDemoSigningSecret();
