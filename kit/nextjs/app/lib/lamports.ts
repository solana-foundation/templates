import { lamports, type Lamports } from "@solana/kit";

const LAMPORTS_PER_SOL = 1_000_000_000n;

export function lamportsFromSol(sol: number): Lamports {
  const whole = Math.trunc(sol);
  const frac = sol - whole;
  return lamports(
    BigInt(whole) * LAMPORTS_PER_SOL +
      BigInt(Math.round(frac * Number(LAMPORTS_PER_SOL)))
  );
}

export function lamportsToSolString(amount: Lamports, maxDecimals = 2): string {
  const whole = amount / LAMPORTS_PER_SOL;
  const fractional = amount % LAMPORTS_PER_SOL;

  if (fractional === 0n) return whole.toString();

  const decimals = fractional
    .toString()
    .padStart(9, "0")
    .slice(0, maxDecimals)
    .replace(/0+$/, "");

  if (decimals === "") {
    if (whole > 0n) return whole.toString();
    return `<0.${"0".repeat(maxDecimals - 1)}1`;
  }

  return `${whole}.${decimals}`;
}
