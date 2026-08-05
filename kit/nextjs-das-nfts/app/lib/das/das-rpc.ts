import {
  createDefaultRpcTransport,
  createJsonRpcApi,
  createRpc,
  type Rpc,
  type RpcResponse,
  type RpcResponseData,
} from "@solana/kit";

import { toDasParams } from "./params";
import type { DasApi } from "./types/api";

export type DasRpcConfig = Readonly<{
  /**
   * Rename the params Helius spells differently from the Metaplex spec — `mintAddress` to
   * `mint` on `getNftEditions`, and `ownerAddress`/`mintAddress` to `owner`/`mint` on
   * `getTokenAccounts`. Default: `false`.
   */
  heliusCompatibility?: boolean;
  /**
   * Full DAS endpoint, including whatever auth the provider expects. Providers differ:
   * Helius and Shyft take an API key as a query param, QuickNode and Triton as a path
   * segment.
   */
  url: string;
}>;

/**
 * Creates an RPC client for the Metaplex Digital Asset Standard API.
 *
 * Unlike the base Solana JSON-RPC, DAS methods take a single named-parameter object rather
 * than positional arguments, so the request transformer lifts the lone call argument up to
 * be the `params` payload and strips the keys a provider would reject.
 *
 * Results are returned exactly as the provider sent them, including `snake_case` field
 * names, and a missing asset comes back as whatever the provider chose to return rather
 * than raising.
 */
export function createDasRpc(config: DasRpcConfig): Rpc<DasApi> {
  const heliusCompatibility = config.heliusCompatibility ?? false;
  const api = createJsonRpcApi<DasApi>({
    requestTransformer: (request) => ({
      ...request,
      params: toDasParams(
        request.methodName,
        request.params,
        heliusCompatibility
      ),
    }),
    responseTransformer: (response: RpcResponse) => {
      const r = response as RpcResponseData<unknown>;
      if ("error" in r) {
        const detail =
          r.error.data == null
            ? ""
            : ` — ${typeof r.error.data === "string" ? r.error.data : JSON.stringify(r.error.data)}`;
        throw new Error(
          `DAS RPC error ${r.error.code}: ${r.error.message}${detail}`
        );
      }
      return r.result;
    },
  });
  const transport = createDefaultRpcTransport({ url: config.url });
  return createRpc({ api, transport });
}
