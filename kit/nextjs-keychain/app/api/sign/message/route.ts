import { createSignableMessage, getBase58Decoder } from "@solana/kit";

import { getSigner } from "@/app/lib/signer";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const message: unknown = body?.message;
  if (typeof message !== "string" || message.length === 0) {
    return Response.json(
      { error: "Body must be { message: string }" },
      { status: 400 }
    );
  }
  try {
    const signer = await getSigner();
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
