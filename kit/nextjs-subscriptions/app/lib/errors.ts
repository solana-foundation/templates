import {
  isSolanaError,
  SOLANA_ERROR__INSTRUCTION_ERROR__CUSTOM,
} from "@solana/kit";
import { getSubscriptionsErrorMessage } from "@solana/subscriptions";

export function parseTransactionError(err: unknown): string {
  if (err instanceof Error && err.message.includes("User rejected")) {
    return "Transaction was rejected by the wallet.";
  }

  const code = getCustomErrorCode(err);
  if (code !== undefined) {
    try {
      const message = getSubscriptionsErrorMessage(
        code as Parameters<typeof getSubscriptionsErrorMessage>[0]
      );
      if (message) return message;
    } catch {
      // Not a known subscriptions program error; fall through.
    }
  }

  const message = getDeepestMessage(err);
  return message.length > 200 ? `${message.slice(0, 200)}...` : message;
}

export function getCustomErrorCode(err: unknown): number | undefined {
  let current: unknown = err;
  while (current) {
    if (
      isSolanaError(current, SOLANA_ERROR__INSTRUCTION_ERROR__CUSTOM) &&
      typeof current.context?.code === "number"
    ) {
      return current.context.code;
    }
    current = current instanceof Error ? current.cause : undefined;
  }
  const match = getDeepestMessage(err).match(
    /custom program error:?\s*#?(\d+)/i
  );
  return match ? Number(match[1]) : undefined;
}

function getDeepestMessage(err: unknown): string {
  let deepest = err instanceof Error ? err.message : String(err);
  let current: unknown = err;

  while (current instanceof Error && current.cause) {
    current = current.cause;
    if (current instanceof Error) {
      deepest = current.message;
    }
  }

  return deepest;
}
