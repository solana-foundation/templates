import type { Address, Signature } from "@solana/kit";

/**
 * Field names throughout these types mirror the DAS wire format verbatim, which is
 * `snake_case` (`json_uri`, `data_hash`, `ownership_model`). Responses are handed back
 * exactly as the provider sent them, so these names can be read straight off the
 * Metaplex spec and provider docs.
 */

/**
 * A string union that still accepts unlisted values.
 *
 * DAS providers do not agree on the casing or membership of several enums — `tokenType`
 * is `NonFungible` in the spec, `nonFungible` on Helius, and `regularNFT` in the Umi
 * client. Widening keeps autocomplete for the spec values without rejecting a provider
 * that returns something else.
 */
type OpenUnion<T extends string> = (string & {}) | T;

export type DasApiAssetInterface = OpenUnion<
  | "Custom"
  | "Executable"
  | "FungibleAsset"
  | "FungibleToken"
  | "Identity"
  | "LEGACY_NFT"
  | "MplBubblegumV2"
  | "MplCoreAsset"
  | "MplCoreCollection"
  | "MplCoreGroup"
  | "ProgrammableNFT"
  | "V1_NFT"
  | "V1_PRINT"
  | "V2_NFT"
>;

export type DasApiAuthorityScope = OpenUnion<
  "extension" | "full" | "metadata" | "royalty"
>;

export type DasApiFileContext = OpenUnion<
  | "app-desktop"
  | "app-mobile"
  | "app"
  | "vr"
  | "wallet-default"
  | "web-desktop"
  | "web-mobile"
>;

export type DasApiOwnershipModel = OpenUnion<"single" | "token">;

export type DasApiRoyaltyModel = OpenUnion<"creators" | "fanout" | "single">;

export type DasApiUseMethod = OpenUnion<"Burn" | "Multiple" | "Single">;

export type DasApiAssetAuthority = Readonly<{
  address: Address;
  scopes: readonly DasApiAuthorityScope[];
}>;

export type DasApiAssetCreator = Readonly<{
  address: Address;
  share: number;
  verified: boolean;
}>;

export type DasApiAssetGrouping = Readonly<{
  /** Provider-dependent shape. Commonly `{ name, symbol, description, image }` when `showCollectionMetadata` is set. */
  collection_metadata?: Readonly<Record<string, unknown>> | null;
  group_key: string;
  group_value?: string | null;
  verified?: boolean | null;
}>;

export type DasApiAssetFile = Readonly<{
  contexts?: readonly DasApiFileContext[] | null;
  mime?: string | null;
  quality?: Readonly<{ $$schema: string }> | null;
  uri?: string | null;
}>;

/**
 * Off-chain JSON metadata as indexed by the provider. Only `name` and `symbol` are
 * conventional; the underlying JSON is arbitrary, hence the index signature.
 */
export type DasApiMetadata = Readonly<{
  attributes?: readonly Readonly<Record<string, unknown>>[];
  description?: string;
  name?: string;
  symbol?: string;
  token_standard?: string;
}> &
  Readonly<Record<string, unknown>>;

export type DasApiAssetContent = Readonly<{
  $schema: string;
  category?: unknown;
  files?: readonly DasApiAssetFile[] | null;
  json_uri: string;
  links?: Readonly<Record<string, unknown>> | null;
  metadata: DasApiMetadata;
}>;

/**
 * Merkle tree placement for a compressed asset.
 *
 * The hash and `tree` fields are empty strings — not addresses — on assets that are not
 * compressed, so check `compressed` before treating `tree` as an {@link Address}.
 */
export type DasApiAssetCompression = Readonly<{
  asset_data_hash?: string | null;
  asset_hash: string;
  collection_hash?: string | null;
  compressed: boolean;
  creator_hash: string;
  data_hash: string;
  eligible: boolean;
  flags?: number | null;
  leaf_id: number;
  seq: number;
  tree: string;
}>;

export type DasApiAssetOwnership = Readonly<{
  delegate?: Address | null;
  delegated: boolean;
  frozen: boolean;
  non_transferable?: boolean | null;
  owner: Address;
  ownership_model: DasApiOwnershipModel;
}>;

export type DasApiAssetRoyalty = Readonly<{
  basis_points: number;
  basis_points_raw?: number | null;
  locked: boolean;
  percent: number;
  primary_sale_happened: boolean;
  royalty_model: DasApiRoyaltyModel;
  sfbp_inherited?: boolean | null;
  target?: Address | null;
}>;

export type DasApiAssetSupply = Readonly<{
  edition_nonce?: number | null;
  print_current_supply: number;
  print_max_supply: number;
}>;

export type DasApiAssetTokenInfo = Readonly<{
  /** The queried owner's associated token account, when the request scoped to an owner. */
  associated_token_address?: Address;
  /** The queried owner's balance, when the request scoped to an owner. */
  balance?: number;
  decimals: number;
  freeze_authority?: Address | null;
  mint_authority?: Address | null;
  /** Provider-dependent; Helius returns this for verified tokens. */
  price_info?: Readonly<Record<string, unknown>>;
  supply: number;
  token_program: Address;
}>;

export type DasApiAssetInscription = Readonly<{
  authority: Address;
  content: string;
  encoding: string;
  inscription_data: string;
  order: number;
  root: string;
  size: number;
  validation_hash?: string | null;
}>;

export type DasApiAssetUses = Readonly<{
  remaining: number;
  total: number;
  use_method: DasApiUseMethod;
}>;

export type DasApiMplCoreInfo = Readonly<{
  current_size?: number | null;
  num_minted?: number | null;
  plugins_json_version?: number | null;
}>;

/**
 * A digital asset as indexed by a DAS provider.
 *
 * Only `burnt`, `id`, `interface`, and `mutable` are guaranteed present by the spec —
 * everything else is nullable, and which fields a provider actually populates depends on
 * the asset's `interface` and the `options` passed with the request.
 */
export type DasApiAsset = Readonly<{
  /** Canonical token mint from the MPL Core `AgentIdentityV2` PDA, when set. */
  agent_token?: Address | null;
  /** MPL Core Asset Signer PDA — an agent's on-chain wallet. */
  asset_signer?: Address | null;
  authorities?: readonly DasApiAssetAuthority[] | null;
  burnt: boolean;
  compression?: DasApiAssetCompression | null;
  content?: DasApiAssetContent | null;
  creators?: readonly DasApiAssetCreator[] | null;
  external_plugins?: unknown;
  grouping?: readonly DasApiAssetGrouping[] | null;
  id: Address;
  /** Populated only when `options.showInscription` is set. */
  inscription?: DasApiAssetInscription | null;
  interface: DasApiAssetInterface;
  /** Whether the MPL Core asset carries an `AgentIdentity` external plugin. */
  is_agent?: boolean | null;
  /** Slot the provider's index was current as of. Provider-specific; Helius returns it. */
  last_indexed_slot?: number;
  mint_extensions?: unknown;
  mpl_core_info?: DasApiMplCoreInfo | null;
  mutable: boolean;
  ownership?: DasApiAssetOwnership | null;
  plugins?: unknown;
  royalty?: DasApiAssetRoyalty | null;
  supply?: DasApiAssetSupply | null;
  /** Populated only when `options.showFungible` is set. */
  token_info?: DasApiAssetTokenInfo | null;
  unknown_external_plugins?: unknown;
  unknown_plugins?: unknown;
  uses?: DasApiAssetUses | null;
}>;

export type DasApiError = Readonly<{
  error?: string;
  id?: string;
}>;

/**
 * A page of assets.
 *
 * The shape stays open because providers add their own keys beyond the ones named here.
 */
export type DasApiAssetList = Readonly<{
  after?: string | null;
  before?: string | null;
  cursor?: string | null;
  errors?: readonly DasApiError[];
  /** Total matches across all pages, when the provider supports `options.showGrandTotal`. */
  grand_total?: number;
  items?: readonly DasApiAsset[];
  last_indexed_slot?: number;
  limit?: number;
  /**
   * The owner's SOL balance, when the provider supports `options.showNativeBalance`.
   * Note the camelCase key — providers spell this one differently from every other field.
   */
  nativeBalance?: Readonly<{
    lamports: number;
    price_per_sol?: number;
    total_price?: number;
  }>;
  page?: number | null;
  total?: number;
}> &
  Readonly<Record<string, unknown>>;

export type DasApiAssetProof = Readonly<{
  last_indexed_slot?: number;
  leaf: string;
  node_index: number;
  proof: readonly string[];
  root: string;
  tree_id: Address;
}>;

/**
 * One transaction that touched a compressed asset, as a `[signature, instructionName]`
 * pair — the shape the spec declares and that Helius and Aura return.
 */
export type DasApiTransactionSignature = readonly [
  signature: Signature,
  instructionName: string,
];

export type DasApiTransactionSignatureList = Readonly<{
  after?: string | null;
  before?: string | null;
  items?: readonly DasApiTransactionSignature[];
  last_indexed_slot?: number;
  limit?: number;
  page?: number | null;
  total?: number;
}>;

export type DasApiGrouping = Readonly<{
  group_key?: string;
  group_name?: string;
  group_size?: number;
}>;

export type DasApiTokenAccount = Readonly<{
  address?: Address;
  amount?: number;
  close_authority?: Address | null;
  delegate?: Address | null;
  delegated_amount?: number;
  extensions?: unknown;
  frozen?: boolean;
  mint?: Address;
  owner?: Address;
}>;

export type DasApiTokenAccountList = Readonly<{
  after?: string | null;
  before?: string | null;
  cursor?: string | null;
  errors?: readonly DasApiError[];
  last_indexed_slot?: number;
  limit?: number;
  page?: number | null;
  token_accounts?: readonly DasApiTokenAccount[];
  total?: number;
}>;

export type DasApiNftEdition = Readonly<{
  edition_address?: Address;
  edition_number?: number;
  mint_address?: Address;
}>;

export type DasApiNftEditionList = Readonly<{
  after?: string | null;
  before?: string | null;
  cursor?: string | null;
  editions?: readonly DasApiNftEdition[];
  last_indexed_slot?: number;
  limit?: number;
  master_edition_address?: Address;
  max_supply?: number | null;
  page?: number | null;
  /** Total editions minted. Note that `total` is the size of the current page, not this. */
  supply?: number;
  total?: number;
}>;
