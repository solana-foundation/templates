import { backendName, getSigner } from "@/app/lib/signer";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const signer = await getSigner();
    return Response.json({
      available: await signer.isAvailable(),
      backend: backendName,
      address: signer.address,
    });
  } catch (error) {
    return Response.json(
      { available: false, backend: backendName, error: String(error) },
      { status: 503 }
    );
  }
}
