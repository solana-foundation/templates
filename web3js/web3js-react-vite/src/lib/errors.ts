const REJECTED = /user (?:rejected|declined)|rejected by (?:the )?user/i;
const INSUFFICIENT_FUNDS =
  /insufficient (?:lamports|funds)|attempt to debit an account but found no record of a prior credit/i;
const MAX_MESSAGE_LENGTH = 200;

export function parseTransactionError(err: unknown): string {
  const messages = getErrorMessages(err);

  if (messages.some((message) => REJECTED.test(message))) {
    return "Transaction was rejected by the wallet.";
  }
  if (messages.some((message) => INSUFFICIENT_FUNDS.test(message))) {
    return "Insufficient balance. Lower the amount and keep enough SOL for fees and account rent.";
  }

  const message = messages.at(-1) || "Unknown error";
  return message.length > MAX_MESSAGE_LENGTH
    ? `${message.slice(0, MAX_MESSAGE_LENGTH)}...`
    : message;
}

function getErrorMessages(err: unknown): string[] {
  if (!(err instanceof Error)) return [String(err)];

  const messages: string[] = [];
  let current: unknown = err;
  while (current instanceof Error) {
    if (current.message) messages.push(current.message);
    current = current.cause;
  }
  return messages;
}
