import { NextResponse } from "next/server";
import { issueNonce } from "../../../lib/auth/nonce-store";

export function GET() {
  return NextResponse.json(
    { nonce: issueNonce() },
    { headers: { "Cache-Control": "no-store" } }
  );
}
