/** Polls transaction indexing without submitting another payment. */
export async function waitForTransaction<T>(
  read: () => Promise<T | null>,
  attempts = 15,
  delayMs = 2000
): Promise<T | null> {
  for (let attempt = 0; attempt < attempts; attempt++) {
    const transaction = await read();
    if (transaction !== null) return transaction;
    if (attempt + 1 < attempts) await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  return null;
}
