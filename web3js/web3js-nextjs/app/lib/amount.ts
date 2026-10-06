const MAX_U64 = (1n << 64n) - 1n;

export function parseAmount(value: string, decimals: number): bigint {
  const match = /^(\d+)(?:\.(\d+))?$/.exec(value.trim());
  const [, whole, fraction = ""] = match ?? [];
  if (!whole || fraction.length > decimals) {
    throw new Error(`Enter an amount with up to ${decimals} decimal places`);
  }

  const units =
    BigInt(whole) * 10n ** BigInt(decimals) +
    BigInt(fraction.padEnd(decimals, "0"));

  if (units <= 0n) throw new Error("Amount must be greater than zero");
  if (units > MAX_U64) throw new Error("Amount is too large");
  return units;
}

export function getAmountError(value: string, decimals: number) {
  try {
    parseAmount(value, decimals);
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : "Invalid amount";
  }
}

export function formatAmount(units: bigint, decimals: number): string {
  const base = 10n ** BigInt(decimals);
  const whole = (units / base).toLocaleString("en-US");
  const fraction = (units % base)
    .toString()
    .padStart(decimals, "0")
    .replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole;
}
