import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  decodeSession,
  getAppUrl,
  getAuthSecret,
  isSameOrigin,
  sessionCookieOptions,
} from "../../../lib/auth/session";

export function GET(request: NextRequest) {
  let secret: string;
  try {
    secret = getAuthSecret();
  } catch (err) {
    return NextResponse.json(
      { session: null, error: (err as Error).message },
      { status: 500 }
    );
  }

  const session = decodeSession(
    request.cookies.get(SESSION_COOKIE)?.value,
    secret
  );
  return NextResponse.json(
    { session },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export function DELETE(request: NextRequest) {
  let appUrl: URL;
  try {
    appUrl = getAppUrl(request);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }

  if (!isSameOrigin(request, appUrl)) {
    return NextResponse.json(
      { error: "Cross-origin sign-out rejected" },
      { status: 403 }
    );
  }

  const response = NextResponse.json({ session: null });
  response.cookies.set(SESSION_COOKIE, "", sessionCookieOptions(0));
  return response;
}
