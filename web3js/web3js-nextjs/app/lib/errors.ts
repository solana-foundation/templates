export function parseTransactionError(err: unknown): string {
  if (errorChainIncludes(err, /user (?:rejected|declined)|rejected by user/i)) {
    return "Request was rejected in the wallet.";
  }

  const message = getDeepestMessage(err);
  return message.length > 200 ? `${message.slice(0, 200)}...` : message;
}

function errorChainIncludes(err: unknown, pattern: RegExp): boolean {
  let current: unknown = err;

  while (current instanceof Error) {
    if (pattern.test(current.message)) return true;
    current = current.cause;
  }

  return false;
}

function getDeepestMessage(err: unknown): string {
  let deepest = err instanceof Error ? err.message : String(err);
  let current: unknown = err;

  while (current instanceof Error && current.cause) {
    current = current.cause;
    if (current instanceof Error && current.message) {
      deepest = current.message;
    }
  }

  return deepest;
}
