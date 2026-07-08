import { getSigner } from "@/app/lib/signer";

export const dynamic = "force-dynamic";

export async function GET() {
  const signer = await getSigner();
  return Response.json({ address: signer.address });
}
