/**
 * Param keys Helius names differently from the Metaplex spec, per method.
 */
const HELIUS_RENAMES: Readonly<
  Record<string, Readonly<Record<string, string>>>
> = {
  getNftEditions: { mintAddress: "mint" },
  getTokenAccounts: { mintAddress: "mint", ownerAddress: "owner" },
};

/**
 * Drops top-level keys a provider would reject: an explicit `null` where the key being
 * absent is accepted instead, and objects that carry no keys at all.
 *
 * Empty arrays are preserved — an empty `ids` list is a meaningful request. Nested objects
 * are passed through as given; only `options` and `sortBy` nest, and neither accepts a
 * `null` member.
 */
function dropEmptyValues(
  params: Readonly<Record<string, unknown>>
): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value == null) {
      continue;
    }
    if (
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).length === 0
    ) {
      continue;
    }
    cleaned[key] = value;
  }
  return cleaned;
}

function applyRenames(
  methodName: string,
  params: Record<string, unknown>
): Record<string, unknown> {
  const renames = HELIUS_RENAMES[methodName];
  if (renames == null) {
    return params;
  }
  const renamed: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(params)) {
    renamed[renames[key] ?? key] = value;
  }
  return renamed;
}

/**
 * Turns the argument list of a `Rpc<DasApi>` method call into the single named-parameter
 * object that DAS expects.
 *
 * `createJsonRpcApi` collects call arguments into an array, but every DAS method takes one
 * named object, so the first argument becomes the `params` payload itself rather than being
 * nested inside an array.
 */
export function toDasParams(
  methodName: string,
  rawParams: unknown,
  heliusCompatibility: boolean
): Record<string, unknown> {
  const first = Array.isArray(rawParams) ? rawParams[0] : rawParams;
  const input =
    first != null && typeof first === "object"
      ? (first as Record<string, unknown>)
      : {};
  const cleaned = dropEmptyValues(input);
  return heliusCompatibility ? applyRenames(methodName, cleaned) : cleaned;
}
