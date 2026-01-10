import * as Clipboard from 'expo-clipboard'

/**
 * Truncates a long address for display purposes
 * Example: "5eykt...3j9ss"
 * @param address - Full address string
 * @param chars - Number of characters to show at start and end (default: 4)
 * @returns Truncated address with ellipsis
 */
export function truncateAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

/**
 * Copies text to device clipboard
 * Uses expo-clipboard for cross-platform compatibility
 * @param text - Text to copy to clipboard
 */
export async function copyToClipboard(text: string): Promise<void> {
  await Clipboard.setStringAsync(text)
}
