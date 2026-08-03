import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  createSessionToken,
  readSessionToken,
  verifyAuthProof,
  type SignedAuthProof,
} from "../../lib/auth";
import { consumeNonce } from "../../lib/nonce-store";

export const dynamic = "force-dynamic";

type SignInBody = SignedAuthProof & { nonce: string };

export async function POST(req: NextRequest) {
  let body: Partial<SignInBody>;
  try {
    body = (await req.json()) as Partial<SignInBody>;
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }
  if (
    !body.nonce ||
    !body.address ||
    !body.messageBytesBase64 ||
    !body.signatureBase64
  ) {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  if (!consumeNonce(body.nonce)) {
    return NextResponse.json(
      { error: "Nonce is unknown, expired, or already used." },
      { status: 401 }
    );
  }

  const result = await verifyAuthProof(
    {
      address: body.address,
      messageBytesBase64: body.messageBytesBase64,
      signatureBase64: body.signatureBase64,
    },
    body.nonce
  );

  if (!result.ok) {
    return NextResponse.json({ error: result.reason }, { status: 401 });
  }

  const res = NextResponse.json({ address: result.address });
  res.cookies.set(SESSION_COOKIE, createSessionToken(result.address), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}

export function GET(req: NextRequest) {
  const address = readSessionToken(req.cookies.get(SESSION_COOKIE)?.value);
  return NextResponse.json({ address });
}

export function DELETE() {
  const res = NextResponse.json({ address: null });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
