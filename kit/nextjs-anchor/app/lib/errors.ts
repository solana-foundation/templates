import {
  getVaultErrorMessage,
  VAULT_ERROR__VAULT_ALREADY_EXISTS,
  VAULT_ERROR__INVALID_AMOUNT,
  type VaultError,
} from "../generated/vault";

const COMMON_ERRORS: Record<string, string> = {
  "User rejected": "Transaction was rejected by the wallet.",
  "Attempt to debit an account but found no record of a prior credit":
    "Account not found. Make sure you have SOL in your wallet.",
  "insufficient lamports": "Not enough SOL in your wallet.",
  "custom program error: 0x0": "Insufficient funds for this transaction.",
  "Transaction simulation failed":
    "Transaction simulation failed. Check your inputs and try again.",
};

const VAULT_ERROR_CODES: Record<number, VaultError> = {
  6000: VAULT_ERROR__VAULT_ALREADY_EXISTS,
  6001: VAULT_ERROR__INVALID_AMOUNT,
};

/**
 * Walk the error's cause chain and collect all messages into one string.
 */
function collectMessages(err: unknown): string {
  const messages: string[] = [];
  let current: unknown = err;

  while (current) {
    if (current instanceof Error) {
      messages.push(current.message);
      current = current.cause;
    } else if (
      typeof current === "object" &&
      current !== null &&
      "message" in current
    ) {
      messages.push(String((current as { message: unknown }).message));
      current =
        "cause" in current ? (current as { cause: unknown }).cause : undefined;
    } else {
      if (messages.length === 0) messages.push(String(current));
      break;
    }
  }

  return messages.join(" → ");
}

export function parseTransactionError(err: unknown): string {
  const fullChain = collectMessages(err);

  // Check for vault program errors (Anchor custom error codes)
  const codeMatch = fullChain.match(/custom program error: 0x([0-9a-fA-F]+)/);
  if (codeMatch) {
    const code = parseInt(codeMatch[1], 16);
    const vaultError = VAULT_ERROR_CODES[code];
    if (vaultError !== undefined) {
      return getVaultErrorMessage(vaultError);
    }
  }

  // Check for known error patterns across the full cause chain
  for (const [pattern, friendly] of Object.entries(COMMON_ERRORS)) {
    if (fullChain.includes(pattern)) {
      return friendly;
    }
  }

  // Return the deepest (root cause) message if available, otherwise the top-level
  const rootMessage = err instanceof Error ? err.message : String(err);
  const trimmed =
    rootMessage.length > 200 ? `${rootMessage.slice(0, 200)}…` : rootMessage;
  return trimmed;
}
