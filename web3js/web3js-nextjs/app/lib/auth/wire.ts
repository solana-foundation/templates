import { getBase64Decoder, getBase64Encoder } from "@solana/kit";
import type {
  SolanaSignInInput,
  SolanaSignInOutput,
} from "@solana/wallet-adapter";

export type SignInRequestBody = {
  input: SolanaSignInInput;
  output: {
    address: string;
    publicKey: string;
    signedMessage: string;
    signature: string;
    signedMessageFormat?: SolanaSignInOutput["signedMessageFormat"];
  };
};

const toBase64 = (bytes: Uint8Array) => getBase64Decoder().decode(bytes);
const fromBase64 = (value: unknown, length?: number) => {
  if (typeof value !== "string") throw new Error("Expected a base64 string");
  const bytes = new Uint8Array(getBase64Encoder().encode(value));
  if (length !== undefined && bytes.length !== length) {
    throw new Error(`Expected ${length} bytes, got ${bytes.length}`);
  }
  return bytes;
};

export function encodeSignInRequest(
  input: SolanaSignInInput,
  output: SolanaSignInOutput
): SignInRequestBody {
  return {
    input,
    output: {
      address: output.account.address,
      publicKey: toBase64(output.account.publicKey as Uint8Array),
      signedMessage: toBase64(output.signedMessage),
      signature: toBase64(output.signature),
      signedMessageFormat: output.signedMessageFormat,
    },
  };
}

export function decodeSignInRequest(body: unknown): {
  input: SolanaSignInInput;
  output: SolanaSignInOutput;
} {
  const { input, output } = (body ?? {}) as Partial<SignInRequestBody>;
  if (!input || typeof input !== "object") throw new Error("Missing input");
  if (!output || typeof output.address !== "string") {
    throw new Error("Missing output");
  }

  return {
    input,
    output: {
      account: {
        address: output.address,
        publicKey: fromBase64(output.publicKey, 32),
        chains: [],
        features: [],
      },
      signedMessage: fromBase64(output.signedMessage),
      signature: fromBase64(output.signature, 64),
      signedMessageFormat: output.signedMessageFormat,
    },
  };
}
