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

const HOSTNAME_LABEL = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

/**
 * Matches the `**.example.com` subdomain wildcard that `remotePatterns` accepts.
 *
 * The subdomain part is validated label by label rather than by suffix alone. A bare suffix
 * test would admit hostnames with empty labels, such as `..example.com`, which this accepts
 * but the image optimizer rejects — and a host this says yes to and the optimizer says no to
 * is a broken image rather than a placeholder.
 */
function matchesHost(hostname: string, pattern: string): boolean {
  if (!pattern.startsWith("**.")) return hostname === pattern;

  const suffix = pattern.slice(3);
  if (!hostname.endsWith(`.${suffix}`)) return false;

  const subdomain = hostname.slice(0, -(suffix.length + 1));
  return (
    subdomain.length > 0 &&
    subdomain.split(".").every((label) => HOSTNAME_LABEL.test(label))
  );
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
