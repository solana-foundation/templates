const MAX_U64 = (1n << 64n) - 1n;

export function parseAmount(amount: string, decimals: number): bigint {
  const pattern =
    decimals > 0
      ? new RegExp(`^(\\d+)(?:\\.(\\d{0,${decimals}}))?$`)
      : /^(\d+)$/;
  const match = pattern.exec(amount.trim());
  if (!match) {
    throw new Error(
      decimals > 0
        ? `Enter an amount with up to ${decimals} decimal places`
        : "Enter a whole number"
    );
  }

  const [, whole, fraction = ""] = match;
  const units =
    BigInt(whole) * 10n ** BigInt(decimals) +
    BigInt(fraction.padEnd(decimals, "0") || "0");

  if (units <= 0n) throw new Error("Amount must be greater than zero");
  if (units > MAX_U64) throw new Error("Amount is too large");

  return units;
}

export function getAmountError(
  amount: string,
  decimals: number
): string | null {
  try {
    parseAmount(amount, decimals);
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : "Invalid amount";
  }
}

export function formatAmount(units: bigint, decimals: number): string {
  const base = 10n ** BigInt(decimals);
  const whole = units / base;
  const fraction = (units % base)
    .toString()
    .padStart(decimals, "0")
    .replace(/0+$/, "");
  const formattedWhole = whole.toLocaleString("en-US");
  return fraction ? `${formattedWhole}.${fraction}` : formattedWhole;
}
