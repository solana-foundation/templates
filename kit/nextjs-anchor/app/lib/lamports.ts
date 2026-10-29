import { lamports, type Lamports } from "@solana/kit";

const LAMPORTS_PER_SOL = 1_000_000_000n;

export function lamportsFromSol(sol: string): Lamports | null {
  const value = sol.trim();
  if (!/^\d*(?:\.\d{0,9})?$/.test(value)) return null;
  const [whole, fraction = ""] = value.split(".");

  try {
    const amount = lamports(
      BigInt(whole || "0") * LAMPORTS_PER_SOL + BigInt(fraction.padEnd(9, "0"))
    );
    return amount > 0n ? amount : null;
  } catch {
    return null;
  }
}

export function lamportsToSolString(amount: Lamports, maxDecimals = 2): string {
  const whole = amount / LAMPORTS_PER_SOL;
  const fractional = amount % LAMPORTS_PER_SOL;

  if (fractional === 0n) return whole.toString();

  const decimals = fractional.toString().padStart(9, "0").slice(0, maxDecimals);

  if (decimals.replace(/0+$/, "") === "") return whole.toString();

  return `${whole}.${decimals.replace(/0+$/, "")}`;
}
