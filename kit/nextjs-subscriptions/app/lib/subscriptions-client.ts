import { createEmptyClient, type TransactionSigner } from "@solana/kit";
import { solanaRpc } from "@solana/kit-plugin-rpc";
import { signer } from "@solana/kit-plugin-signer";
import { tokenProgram } from "@solana-program/token";
import { subscriptionsProgram } from "@solana/subscriptions";
import { getClusterUrl, type ClusterMoniker } from "./solana-client";

export function createSubscriptionsClient(
  cluster: ClusterMoniker,
  walletSigner: TransactionSigner
) {
  return createEmptyClient()
    .use(signer(walletSigner))
    .use(solanaRpc({ rpcUrl: getClusterUrl(cluster) }))
    .use(tokenProgram())
    .use(subscriptionsProgram());
}

export type SubscriptionsClient = ReturnType<typeof createSubscriptionsClient>;
