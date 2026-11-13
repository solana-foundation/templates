import assert from "node:assert/strict";
import { test } from "node:test";
import { lamportsFromSol } from "../app/lib/lamports.ts";

test("converts decimal SOL strings to exact lamports", () => {
  for (const [input, expected] of [
    ["1.5", 1_500_000_000n],
    [".5", 500_000_000n],
    ["1.", 1_000_000_000n],
    [" 0001.500000000 ", 1_500_000_000n],
    ["0.000000001", 1n],
    ["0.000000015", 15n],
    ["1.000000007", 1_000_000_007n],
    ["9007199.254740993", 9_007_199_254_740_993n],
    ["18446744073.709551615", 18_446_744_073_709_551_615n],
  ]) {
    assert.equal(lamportsFromSol(input), expected, input);
  }
});

test("rejects invalid amounts instead of rounding or truncating them", () => {
  for (const input of [
    "",
    " ",
    "0",
    "0.000000000",
    "-1",
    "+1",
    "1e3",
    "NaN",
    "Infinity",
    "0x10",
    "1,5",
    "1.2.3",
    "1 SOL",
    "1_0",
    "1._5",
    "1.5_",
    "1. 5",
    ".",
    "0.0000000005",
    "1.0000000000",
    "18446744073.709551616",
    "18446744074",
    "1".repeat(100),
  ]) {
    assert.equal(lamportsFromSol(input), null, input);
  }
});
