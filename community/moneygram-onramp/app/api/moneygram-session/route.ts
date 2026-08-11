import { NextResponse } from "next/server";

// Server-side session creation. The MoneyGram secret key never reaches the browser.
// Set these in .env.local (see .env.example):
//   MONEYGRAM_SK           ramps_sk_sbox_...
//   MONEYGRAM_SESSIONS_URL https://playground.xramps.moneygram.com/api/v1/sessions

const SESSIONS_URL =
  process.env.MONEYGRAM_SESSIONS_URL ??
  "https://playground.xramps.moneygram.com/api/v1/sessions";

export async function POST() {
  const secretKey = process.env.MONEYGRAM_SK;
  if (!secretKey) {
    return NextResponse.json(
      {
        error:
          "MONEYGRAM_SK is not set. Copy .env.example to .env.local and add your sandbox secret key.",
      },
      { status: 500 }
    );
  }

  const mgiRes = await fetch(SESSIONS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": secretKey },
    body: JSON.stringify({}),
  });

  const data = await mgiRes.json();
  if (!mgiRes.ok) {
    return NextResponse.json(data, { status: mgiRes.status });
  }

  return NextResponse.json({
    sessionToken: data.sessionToken,
    sessionId: data.sessionId,
    widgetUrl: data.widgetUrl,
  });
}
