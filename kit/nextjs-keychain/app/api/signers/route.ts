import { configuredBackends } from "@/app/lib/config";
import { getSigner } from "@/app/lib/signer";

export const dynamic = "force-dynamic";

export async function GET() {
  const signers = await Promise.all(
    configuredBackends().map(async (backend) => {
      try {
        const signer = await getSigner(backend);
        return {
          backend,
          address: signer.address,
          available: await signer.isAvailable(),
        };
      } catch (error) {
        return { backend, available: false, error: String(error) };
      }
    })
  );
  return Response.json({ signers });
}
