import { spawn } from "node:child_process";
import { resolve } from "node:path";
import {
  address,
  generateKeyPairSigner,
  getAddressEncoder,
  getProgramDerivedAddress,
} from "@solana/kit";

const RPC_URL = "http://127.0.0.1:8899";
const WS_URL = "ws://127.0.0.1:8900";
const TOKEN_PROGRAM = address("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
const ASSOCIATED_TOKEN_PROGRAM = address(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);
const MEMO_PROGRAM = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";

async function rpc(method, params) {
  const response = await fetch(RPC_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const result = await response.json();
  if (result.error) throw new Error(JSON.stringify(result.error));
  return result.result;
}

export class Surfnet {
  static async start() {
    const validator = spawn(
      process.env.SOLANA_TEST_VALIDATOR ?? "solana-test-validator",
      [
        "--reset",
        "--quiet",
        "--bpf-program",
        MEMO_PROGRAM,
        resolve(process.cwd(), "tests/fixtures/spl_memo_v4.so"),
      ],
      { stdio: "ignore" }
    );
    const runtime = new Surfnet(validator);
    for (let attempt = 0; attempt < 60; attempt++) {
      try {
        await rpc("getHealth", []);
        return runtime;
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    }
    runtime.stop();
    throw new Error("Agave test validator did not start");
  }

  constructor(process) {
    this.process = process;
    this.rpcUrl = RPC_URL;
    this.wsUrl = WS_URL;
  }

  async fundSol(owner, amount) {
    const signature = await rpc("requestAirdrop", [owner, Number(amount)]);
    await rpc("getSignatureStatuses", [
      [signature],
      { searchTransactionHistory: true },
    ]);
  }

  deploy() {}

  getAta(owner, mint) {
    return getProgramDerivedAddress({
      programAddress: ASSOCIATED_TOKEN_PROGRAM,
      seeds: [
        getAddressEncoder().encode(address(owner)),
        getAddressEncoder().encode(TOKEN_PROGRAM),
        getAddressEncoder().encode(address(mint)),
      ],
    }).then(([ata]) => ata);
  }

  static async newKeypair() {
    const signer = await generateKeyPairSigner();
    return { publicKey: signer.address, address: signer.address };
  }

  stop() {
    this.process.kill();
  }
}
