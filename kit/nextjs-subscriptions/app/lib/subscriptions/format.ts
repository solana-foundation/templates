export function fromBaseUnits(amount: bigint, decimals: number): string {
  if (decimals === 0) return amount.toString();
  const divisor = 10n ** BigInt(decimals);
  const whole = amount / divisor;
  const fractional = amount % divisor;
  if (fractional === 0n) return whole.toString();
  const decimalsStr = fractional
    .toString()
    .padStart(decimals, "0")
    .replace(/0+$/, "");
  return `${whole}.${decimalsStr}`;
}

export function formatPeriod(hours: number | bigint): string {
  const h = Number(hours);
  if (h % 24 === 0) {
    const days = h / 24;
    return days === 1 ? "day" : `${days} days`;
  }
  return h === 1 ? "hour" : `${h} hours`;
}
