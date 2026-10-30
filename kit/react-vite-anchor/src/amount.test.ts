import { describe, expect, it } from "vitest";
import { formatSolAmount, parseSolAmount } from "./amount";

describe("formatSolAmount", () => {
  it.each([
    [0n, "0.000000000"],
    [1n, "0.000000001"],
    [1_000_000_000n, "1.000000000"],
    [1_000_000_009n, "1.000000009"],
    [9_007_199_254_740_993n, "9007199.254740993"],
    [(1n << 64n) - 1n, "18446744073.709551615"],
  ])("formats %s lamports exactly", (lamports, expected) => {
    expect(formatSolAmount(lamports)).toBe(expected);
  });
});

describe("parseSolAmount", () => {
  it("converts SOL without floating-point rounding", () => {
    expect(parseSolAmount("0.000000001")).toBe(1n);
    expect(parseSolAmount("1.000000009")).toBe(1_000_000_009n);
    expect(parseSolAmount("9007199.254740993")).toBe(9_007_199_254_740_993n);
  });
  it.each([
    "",
    "0",
    "-1",
    "NaN",
    "Infinity",
    "1e9",
    "1.0000000001",
    " 1",
    "1.",
  ])("rejects invalid input %s", (value) => {
    expect(() => parseSolAmount(value)).toThrow();
  });
  it("enforces the program's u64 limit", () => {
    expect(parseSolAmount("18446744073.709551615")).toBe((1n << 64n) - 1n);
    expect(() => parseSolAmount("18446744073.709551616")).toThrow();
  });
});
