import { createEmptyClient, type TransactionSigner } from "@solana/kit";
import { solanaRpc } from "@solana/kit-plugin-rpc";
import { signer } from "@solana/kit-plugin-signer";
import { subscriptionsProgram } from "@solana/subscriptions";
import { getClusterUrl, type ClusterMoniker } from "./solana-client";

export function createSubscriptionsClient(
  cluster: ClusterMoniker,
  walletSigner: TransactionSigner
) {
  return createEmptyClient()
    .use(signer(walletSigner))
    .use(solanaRpc({ rpcUrl: getClusterUrl(cluster) }))
    .use(subscriptionsProgram());
}

export type SubscriptionsClient = ReturnType<typeof createSubscriptionsClient>;
