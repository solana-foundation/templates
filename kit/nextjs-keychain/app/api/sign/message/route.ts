import { createSignableMessage, getBase58Decoder } from "@solana/kit";

import { getSigner } from "@/app/lib/signer";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const message: unknown = body?.message;
  const backend: unknown = body?.backend;
  if (typeof message !== "string" || message.length === 0) {
    return Response.json(
      { error: "Body must be { message: string, backend?: string }" },
      { status: 400 }
    );
  }
  let signer;
  try {
    signer = await getSigner(typeof backend === "string" ? backend : undefined);
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 400 });
  }
  try {
    const [signatures] = await signer.signMessages([
      createSignableMessage(message),
    ]);
    return Response.json({
      address: signer.address,
      signature: getBase58Decoder().decode(signatures[signer.address]),
    });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
