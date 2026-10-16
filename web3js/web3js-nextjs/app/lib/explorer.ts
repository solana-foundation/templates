import type { ClusterMoniker } from "./cluster";

export function getExplorerUrl(path: string, cluster: ClusterMoniker): string {
  const base = "https://explorer.solana.com";
  const url = new URL(path, base);

  if (cluster !== "mainnet") {
    if (cluster === "localnet") {
      url.searchParams.set("cluster", "custom");
      url.searchParams.set("customUrl", "http://localhost:8899");
    } else {
      url.searchParams.set("cluster", cluster);
    }
  }

  return url.toString();
}

export function ellipsify(str: string, chars = 4): string {
  if (str.length <= chars * 2 + 3) return str;
  return `${str.slice(0, chars)}...${str.slice(-chars)}`;
}
