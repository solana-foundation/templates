/**
 * Truncates a blockchain address for display
 * @param address - The full address string
 * @param chars - Number of characters to show at start and end (default: 4)
 * @returns Truncated address in format: "1234...5678"
 */
export function truncateAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Copies text to clipboard using the Clipboard API
 * @param text - The text to copy to clipboard
 */
export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    throw error;
  }
}

