"use client";

import useSWR from "swr";
import { address, type Address } from "@solana/kit";
import { useCluster } from "../../components/cluster-context";
import { useAppClient } from "../client-provider";
import type { DasApiAssetList } from "../das";

export const ASSETS_PER_PAGE = 12;

/**
 * Pages through the assets a wallet holds, via `client.das.getAssetsByOwner`.
 *
 * `owner` is the raw user input, so it is validated here rather than at the call site; an
 * unparseable address is treated the same as no address at all.
 */
export function useOwnedAssets(owner: string, page: number) {
  const { cluster } = useCluster();
  const client = useAppClient();

  let ownerAddress: Address | null = null;
  try {
    ownerAddress = owner ? address(owner) : null;
  } catch {
    ownerAddress = null;
  }

  const { data, error, isLoading } = useSWR<DasApiAssetList>(
    ownerAddress
      ? (["das-assets", cluster, ownerAddress, page] as const)
      : null,
    ownerAddress
      ? () =>
          client.das
            .getAssetsByOwner({
              ownerAddress,
              limit: ASSETS_PER_PAGE,
              page,
              options: { showCollectionMetadata: true },
            })
            .send()
      : null,
    { revalidateOnFocus: false }
  );

  return {
    assets: data?.items ?? [],
    isInvalidAddress: owner.length > 0 && ownerAddress == null,
    isLoading,
    error: error as Error | undefined,
  };
}
