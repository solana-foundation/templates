import { extendClient } from "@solana/kit";

import { createDasRpc, type DasRpcConfig } from "./das-rpc";

/**
 * Installs a Metaplex DAS API client on the client as `das`.
 *
 * DAS carries its own endpoint and transport, so this composes in any order and does not
 * require an RPC plugin to have run first.
 *
 * @example
 * ```ts
 * const client = createClient().use(das({ url: `https://mainnet.helius-rpc.com/?api-key=${key}` }));
 * const asset = await client.das.getAsset({ id }).send();
 * ```
 */
export function das(config: DasRpcConfig) {
  return <T extends object>(client: T) =>
    extendClient(client, { das: createDasRpc(config) });
}
