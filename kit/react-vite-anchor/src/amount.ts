const U64_MAX = (1n << 64n) - 1n;

export function formatSolAmount(lamports: bigint): string {
  const whole = lamports / 1_000_000_000n;
  const fraction = (lamports % 1_000_000_000n).toString().padStart(9, "0");
  return `${whole}.${fraction}`;
}

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
