/** Shortens an address to the leading and trailing characters, the way explorers and wallets do. */
export function formatAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 1) {
    return address
  }
  return `${address.slice(0, chars)}…${address.slice(-chars)}`
}
