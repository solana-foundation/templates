import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "siws_session";
export const SESSION_TTL_SECONDS = 24 * 60 * 60;

export type Session = { address: string; expiresAt: number };

export function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET is missing or shorter than 32 characters. Copy .env.example to .env.local and set it."
    );
  }
  return secret;
}

export function createSession(address: string, now = Date.now()): Session {
  return { address, expiresAt: now + SESSION_TTL_SECONDS * 1000 };
}

export function encodeSession(session: Session, secret: string): string {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

export function decodeSession(
  token: string | undefined,
  secret: string,
  now = Date.now()
): Session | null {
  const [payload, signature, ...rest] = token?.split(".") ?? [];
  if (!payload || !signature || rest.length > 0) return null;

  const expected = Buffer.from(sign(payload, secret));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return null;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (
      typeof session?.address !== "string" ||
      typeof session.expiresAt !== "number" ||
      session.expiresAt <= now
    ) {
      return null;
    }
    return { address: session.address, expiresAt: session.expiresAt };
  } catch {
    return null;
  }
}

export function sessionCookieOptions(maxAge = SESSION_TTL_SECONDS) {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  } as const;
}

/**
 * The origin users sign in from. SIWS messages must name its host as their
 * domain, and state-changing auth requests must come from it. Configured with
 * APP_URL; development falls back to the request's Host header, production
 * refuses to guess because a proxy or attacker controls that header.
 */
export function getAppUrl(request: Request): URL {
  const configured = process.env.APP_URL;
  if (configured) {
    try {
      return new URL(configured);
    } catch {
      throw new Error(`APP_URL is not a valid URL: ${configured}`);
    }
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "APP_URL is not set. Set it to this app's public origin, e.g. https://app.example.com."
    );
  }
  const host = request.headers.get("host");
  if (!host) throw new Error("Request is missing a Host header");
  return new URL(`${new URL(request.url).protocol}//${host}`);
}

// Browsers always send Origin on cross-site POST/DELETE requests, so a
// mismatch means another site is trying to set or clear this app's session.
export function isSameOrigin(request: Request, appUrl: URL): boolean {
  const origin = request.headers.get("origin");
  if (origin === null) return true;
  try {
    return new URL(origin).origin === appUrl.origin;
  } catch {
    return false;
  }
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}
