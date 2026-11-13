import { lamports, type Lamports } from "@solana/kit";
import { lamportsFromSol as parseSol } from "@solana/client";

export function lamportsFromSol(sol: string): Lamports | null {
  const value = sol.trim();
  if (!/^\d*(?:\.\d{0,9})?$/.test(value)) return null;
  const [whole, fraction = ""] = value.split(".");

  try {
    const amount = lamports(parseSol(`${whole || "0"}.${fraction || "0"}`));
    return amount > 0n ? amount : null;
  } catch {
    return null;
  }
}
