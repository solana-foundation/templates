/**
 * Storage networks and IPFS gateways that NFT metadata points at in practice.
 *
 * Off-chain metadata is attacker-controlled — anyone can airdrop an asset whose image URL
 * is a host they own. Loading one in the browser would disclose the viewer's IP address,
 * user agent, and the time they looked at a wallet, so images are restricted to these hosts
 * and served through the Next image optimizer, which fetches them from the server. Add the
 * hosts your own assets use before deploying.
 *
 * Consumed by `next.config.ts` as `images.remotePatterns`; an unlisted host would make
 * `next/image` throw, so `resolveNftImageUrl` rejects it first.
 */
export const NFT_IMAGE_HOSTS = [
  "arweave.net",
  "**.arweave.net",
  "gateway.irys.xyz",
  "**.irys.xyz",
  "ipfs.io",
  "**.ipfs.dweb.link",
  "nftstorage.link",
  "**.ipfs.nftstorage.link",
  "gateway.pinata.cloud",
  "**.mypinata.cloud",
  "shdw-drive.genesysgo.net",
];

const IPFS_GATEWAY = "https://ipfs.io/ipfs/";

/** Matches the `**.example.com` subdomain wildcard that `remotePatterns` accepts. */
function matchesHost(hostname: string, pattern: string): boolean {
  return pattern.startsWith("**.")
    ? hostname.endsWith(pattern.slice(2))
    : hostname === pattern;
}

/**
 * Turns a metadata image URI into an https URL on an allowed host, or `null` when the URI
 * is missing, unparseable, or points somewhere that is not allowed.
 */
export function resolveNftImageUrl(
  uri: string | null | undefined
): string | null {
  if (!uri) return null;

  const resolved = uri.startsWith("ipfs://")
    ? `${IPFS_GATEWAY}${uri.slice("ipfs://".length)}`
    : uri;

  let parsed: URL;
  try {
    parsed = new URL(resolved);
  } catch {
    return null;
  }

  if (parsed.protocol !== "https:") return null;
  const allowed = NFT_IMAGE_HOSTS.some((pattern) =>
    matchesHost(parsed.hostname, pattern)
  );
  return allowed ? parsed.href : null;
}
