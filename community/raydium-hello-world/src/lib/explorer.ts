const CLUSTER = "devnet";

export function getExplorerUrl(signature: string): string {
  return `https://explorer.solana.com/tx/${signature}?cluster=${CLUSTER}`;
}

export function ellipsify(str: string, len = 4): string {
  if (str.length <= len * 2) return str;
  return `${str.slice(0, len)}..${str.slice(-len)}`;
}
