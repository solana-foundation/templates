import { NextResponse, type NextRequest } from "next/server";
import { consumeNonce } from "../../../lib/auth/nonce-store";
import {
  SESSION_COOKIE,
  createSession,
  encodeSession,
  getAppUrl,
  getAuthSecret,
  isSameOrigin,
  sessionCookieOptions,
} from "../../../lib/auth/session";
import { verifySignInRequest } from "../../../lib/auth/siws";
import { decodeSignInRequest } from "../../../lib/auth/wire";

export async function POST(request: NextRequest) {
  let appUrl: URL;
  let secret: string;
  try {
    appUrl = getAppUrl(request);
    secret = getAuthSecret();
  } catch (err) {
    return error((err as Error).message, 500);
  }

  if (!isSameOrigin(request, appUrl)) {
    return error("Cross-origin sign-in rejected", 403);
  }

  let signIn: ReturnType<typeof decodeSignInRequest>;
  try {
    signIn = decodeSignInRequest(await request.json());
  } catch {
    return error("Malformed sign-in request", 400);
  }

  const result = await verifySignInRequest({
    ...signIn,
    expectedDomain: appUrl.host,
    consumeNonce,
  });
  if (!result.ok) return error(result.error, 401);

  const session = createSession(result.address);
  const response = NextResponse.json({ session });
  response.cookies.set(
    SESSION_COOKIE,
    encodeSession(session, secret),
    sessionCookieOptions()
  );
  return response;
}

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}
