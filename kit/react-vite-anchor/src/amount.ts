const U64_MAX = (1n << 64n) - 1n;

export function parseSolAmount(value: string): bigint {
  if (!/^\d+(\.\d{1,9})?$/.test(value)) {
    throw new Error(
      "Enter a positive SOL amount with at most 9 decimal places."
    );
  }
  const [whole, fraction = ""] = value.split(".");
  const amount =
    BigInt(whole) * 1_000_000_000n + BigInt(fraction.padEnd(9, "0"));
  if (amount <= 0n || amount > U64_MAX) {
    throw new Error(
      "Amount must be positive and fit within the program's limit."
    );
  }
  return amount;
}
