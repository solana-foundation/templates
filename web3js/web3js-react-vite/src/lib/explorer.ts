import type { ClusterMoniker } from "./cluster";

export function getExplorerUrl(path: string, cluster: ClusterMoniker): string {
  const url = new URL(path, "https://explorer.solana.com");

  if (cluster === "localnet") {
    url.searchParams.set("cluster", "custom");
    url.searchParams.set("customUrl", "http://localhost:8899");
  } else if (cluster !== "mainnet") {
    url.searchParams.set("cluster", cluster);
  }

  return url.toString();
}

export function ellipsify(str: string, chars = 4): string {
  if (str.length <= chars * 2 + 3) return str;
  return `${str.slice(0, chars)}...${str.slice(-chars)}`;
}
