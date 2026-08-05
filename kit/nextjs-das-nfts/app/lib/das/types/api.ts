import type { Address } from "@solana/kit";

import type {
  DasApiAsset,
  DasApiAssetInterface,
  DasApiAssetList,
  DasApiAssetProof,
  DasApiGrouping,
  DasApiNftEditionList,
  DasApiOwnershipModel,
  DasApiRoyaltyModel,
  DasApiTokenAccountList,
  DasApiTransactionSignatureList,
} from "./asset";

/**
 * Request keys mirror the DAS wire format verbatim — `id`, `ownerAddress`, `groupKey` —
 * so a call can be written straight from the Metaplex spec or a provider's docs without
 * a rename table in between.
 */

type OpenUnion<T extends string> = (string & {}) | T;

export type DasApiSortByField = OpenUnion<
  "created" | "id" | "none" | "recent_action" | "updated"
>;

export type DasApiSortDirection = OpenUnion<"asc" | "desc">;

export type DasApiSortBy = Readonly<{
  sortBy: DasApiSortByField;
  sortDirection?: DasApiSortDirection;
}>;

/**
 * Which extra data the provider should populate on returned assets. All default to `false`.
 *
 * The Metaplex spec names this key `options` on every method. The Umi client sends
 * `displayOptions` on some methods instead; this package always sends `options`.
 */
export type DasApiDisplayOptions = Readonly<{
  showCollectionMetadata?: boolean;
  showFungible?: boolean;
  /** Provider-specific; Helius populates `grand_total` on the returned list. */
  showGrandTotal?: boolean;
  showInscription?: boolean;
  /** Provider-specific; Helius populates `nativeBalance` on the returned list. */
  showNativeBalance?: boolean;
  showUnverifiedCollections?: boolean;
  showZeroBalance?: boolean;
}>;

/**
 * Page selection. Three mutually exclusive mechanisms exist: `page` (1-based),
 * `before`/`after` cursors, and an opaque `cursor`. Providers reject combinations.
 */
export type DasApiPagination = Readonly<{
  after?: string | null;
  before?: string | null;
  cursor?: string | null;
  limit?: number | null;
  page?: number | null;
  sortBy?: DasApiSortBy | null;
}>;

export type DasApiTokenType = OpenUnion<
  "All" | "Compressed" | "Fungible" | "Nft" | "NonFungible"
>;

export type GetAssetInput = Readonly<{
  id: Address;
  options?: DasApiDisplayOptions | null;
}>;

export type GetAssetsInput = Readonly<{
  ids: readonly Address[];
  options?: DasApiDisplayOptions | null;
}>;

export type GetAssetProofInput = Readonly<{
  id: Address;
}>;

export type GetAssetProofsInput = Readonly<{
  ids: readonly Address[];
}>;

export type GetAssetsByOwnerInput = DasApiPagination &
  Readonly<{
    options?: DasApiDisplayOptions | null;
    ownerAddress: Address;
  }>;

export type GetAssetsByAuthorityInput = DasApiPagination &
  Readonly<{
    authorityAddress: Address;
    options?: DasApiDisplayOptions | null;
  }>;

export type GetAssetsByCreatorInput = DasApiPagination &
  Readonly<{
    creatorAddress: Address;
    onlyVerified?: boolean | null;
    options?: DasApiDisplayOptions | null;
  }>;

export type GetAssetsByGroupInput = DasApiPagination &
  Readonly<{
    /** Conventionally `collection`, with `groupValue` the collection mint. */
    groupKey: string;
    groupValue: string;
    options?: DasApiDisplayOptions | null;
  }>;

export type SearchAssetsInput = DasApiPagination &
  Readonly<{
    agentToken?: Address | null;
    assetSigner?: Address | null;
    authorityAddress?: Address | null;
    burnt?: boolean | null;
    compressed?: boolean | null;
    compressible?: boolean | null;
    /** How to combine the filters. Default: `all`. */
    conditionType?: OpenUnion<"all" | "any"> | null;
    creatorAddress?: Address | null;
    creatorVerified?: boolean | null;
    delegate?: Address | null;
    frozen?: boolean | null;
    /** A `[groupKey, groupValue]` pair, e.g. `['collection', <mint>]`. */
    grouping?: readonly [string, string] | null;
    interface?: DasApiAssetInterface | null;
    isAgent?: boolean | null;
    jsonUri?: string | null;
    name?: string | null;
    /** Invert the whole filter set. */
    negate?: boolean | null;
    ownerAddress?: Address | null;
    ownerType?: DasApiOwnershipModel | null;
    options?: DasApiDisplayOptions | null;
    royaltyAmount?: number | null;
    royaltyTarget?: Address | null;
    royaltyTargetType?: DasApiRoyaltyModel | null;
    supply?: number | null;
    supplyMint?: Address | null;
    tokenType?: DasApiTokenType | null;
  }>;

/** Identify the asset either by its `id`, or by its Bubblegum tree and leaf index. */
export type GetAssetSignaturesInput = DasApiPagination &
  Readonly<{ sortDirection?: DasApiSortDirection | null }> &
  (
    | Readonly<{ id: Address; leafIndex?: never; tree?: never }>
    | Readonly<{ id?: never; leafIndex: number; tree: Address }>
  );

export type GetGroupingInput = Readonly<{
  groupKey: string;
  groupValue: string;
}>;

export type GetNftEditionsInput = DasApiPagination &
  Readonly<{
    mintAddress: Address;
  }>;

export type GetTokenAccountsInput = DasApiPagination &
  Readonly<{
    mintAddress?: Address | null;
    options?: DasApiDisplayOptions | null;
    ownerAddress?: Address | null;
  }>;

/** Keyed by asset id. A value is `null` when the asset has no proof (i.e. is not compressed). */
export type GetAssetProofsResponse = Readonly<
  Record<Address, DasApiAssetProof | null>
>;

/** Positionally matches the requested `ids`; an entry is `null` when that asset is not indexed. */
export type GetAssetsResponse = readonly (DasApiAsset | null)[];

export type DasGetAssetApi = {
  /** Fetch a single asset by id. Resolves to whatever the provider returns for an unknown id. */
  getAsset(input: GetAssetInput): DasApiAsset;
};

export type DasGetAssetProofApi = {
  /** Fetch the Merkle proof for a compressed asset. */
  getAssetProof(input: GetAssetProofInput): DasApiAssetProof;
};

export type DasGetAssetProofsApi = {
  /** Fetch Merkle proofs for several compressed assets at once. */
  getAssetProofs(input: GetAssetProofsInput): GetAssetProofsResponse;
};

export type DasGetAssetSignaturesApi = {
  /** List the transactions that touched a compressed asset. */
  getAssetSignatures(
    input: GetAssetSignaturesInput
  ): DasApiTransactionSignatureList;
};

export type DasGetAssetsApi = {
  /** Fetch several assets by id. */
  getAssets(input: GetAssetsInput): GetAssetsResponse;
};

export type DasGetAssetsByAuthorityApi = {
  /** Page through the assets under an update authority. */
  getAssetsByAuthority(input: GetAssetsByAuthorityInput): DasApiAssetList;
};

export type DasGetAssetsByCreatorApi = {
  /** Page through the assets listing an address among their creators. */
  getAssetsByCreator(input: GetAssetsByCreatorInput): DasApiAssetList;
};

export type DasGetAssetsByGroupApi = {
  /** Page through the assets in a group, conventionally a collection. */
  getAssetsByGroup(input: GetAssetsByGroupInput): DasApiAssetList;
};

export type DasGetAssetsByOwnerApi = {
  /** Page through the assets held by a wallet. */
  getAssetsByOwner(input: GetAssetsByOwnerInput): DasApiAssetList;
};

export type DasGetGroupingApi = {
  /** Look up the size of a group, e.g. how many assets are in a collection. */
  getGrouping(input: GetGroupingInput): DasApiGrouping;
};

export type DasGetNftEditionsApi = {
  /** Page through the printed editions of a master edition NFT. */
  getNftEditions(input: GetNftEditionsInput): DasApiNftEditionList;
};

export type DasGetTokenAccountsApi = {
  /** Page through token accounts by owner and/or mint. */
  getTokenAccounts(input: GetTokenAccountsInput): DasApiTokenAccountList;
};

export type DasSearchAssetsApi = {
  /** Page through assets matching an arbitrary filter set. */
  searchAssets(input: SearchAssetsInput): DasApiAssetList;
};

/** The full 13-method Metaplex DAS surface. */
export type DasApi = DasGetAssetApi &
  DasGetAssetProofApi &
  DasGetAssetProofsApi &
  DasGetAssetSignaturesApi &
  DasGetAssetsApi &
  DasGetAssetsByAuthorityApi &
  DasGetAssetsByCreatorApi &
  DasGetAssetsByGroupApi &
  DasGetAssetsByOwnerApi &
  DasGetGroupingApi &
  DasGetNftEditionsApi &
  DasGetTokenAccountsApi &
  DasSearchAssetsApi;
