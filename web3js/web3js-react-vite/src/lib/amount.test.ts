import { describe, expect, it } from "vitest";
import { formatAmount, getAmountError, parseAmount } from "./amount";

describe("parseAmount", () => {
  it("converts decimal strings to base units", () => {
    expect(parseAmount("1", 9)).toBe(1_000_000_000n);
    expect(parseAmount("0.01", 9)).toBe(10_000_000n);
    expect(parseAmount(" 2.5 ", 6)).toBe(2_500_000n);
    expect(parseAmount("1.", 9)).toBe(1_000_000_000n);
    expect(parseAmount("42", 0)).toBe(42n);
  });

  it("rejects malformed, zero, and out-of-range amounts", () => {
    expect(() => parseAmount("", 9)).toThrow();
    expect(() => parseAmount("abc", 9)).toThrow();
    expect(() => parseAmount("-1", 9)).toThrow();
    expect(() => parseAmount("1.0000000001", 9)).toThrow(/9 decimal places/);
    expect(() => parseAmount("0", 9)).toThrow(/greater than zero/);
    expect(() => parseAmount("1.5", 0)).toThrow(/whole number/);
    expect(() => parseAmount("18446744073709551616", 0)).toThrow(/too large/);
  });
});

describe("getAmountError", () => {
  it("returns null for valid amounts and a message otherwise", () => {
    expect(getAmountError("0.5", 9)).toBeNull();
    expect(getAmountError("0", 9)).toBe("Amount must be greater than zero");
  });
});

describe("formatAmount", () => {
  it("formats base units without trailing zeros", () => {
    expect(formatAmount(1_500_000_000n, 9)).toBe("1.5");
    expect(formatAmount(1_000_000_000n, 9)).toBe("1");
    expect(formatAmount(1n, 9)).toBe("0.000000001");
    expect(formatAmount(0n, 9)).toBe("0");
    expect(formatAmount(1_234_567_000_000_000n, 9)).toBe("1,234,567");
  });
});
