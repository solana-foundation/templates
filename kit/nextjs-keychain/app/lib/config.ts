import {
  normalizePrivateKeyPem,
  type BackendName,
  type KeychainSignerConfig,
} from "@solana/keychain";
import { generateKeyPair } from "@solana/kit";

const REQUIRED_ENV: Record<Exclude<BackendName, "memory">, string[]> = {
  "aws-kms": ["AWS_KMS_KEY_ID", "AWS_KMS_PUBLIC_KEY"],
  cdp: [
    "CDP_ADDRESS",
    "CDP_API_KEY_ID",
    "CDP_API_KEY_SECRET",
    "CDP_WALLET_SECRET",
  ],
  crossmint: ["CROSSMINT_API_KEY", "CROSSMINT_WALLET_LOCATOR"],
  dfns: [
    "DFNS_AUTH_TOKEN",
    "DFNS_CRED_ID",
    "DFNS_PRIVATE_KEY_PEM",
    "DFNS_WALLET_ID",
  ],
  fireblocks: [
    "FIREBLOCKS_API_KEY",
    "FIREBLOCKS_PRIVATE_KEY_PEM",
    "FIREBLOCKS_VAULT_ACCOUNT_ID",
  ],
  "gcp-kms": ["GCP_KMS_KEY_NAME", "GCP_KMS_PUBLIC_KEY"],
  openfort: [
    "OPENFORT_ACCOUNT_ID",
    "OPENFORT_SECRET_KEY",
    "OPENFORT_WALLET_SECRET",
  ],
  para: ["PARA_API_KEY", "PARA_WALLET_ID"],
  privy: ["PRIVY_APP_ID", "PRIVY_APP_SECRET", "PRIVY_WALLET_ID"],
  turnkey: [
    "TURNKEY_API_PRIVATE_KEY",
    "TURNKEY_API_PUBLIC_KEY",
    "TURNKEY_ORGANIZATION_ID",
    "TURNKEY_PRIVATE_KEY_ID",
    "TURNKEY_PUBLIC_KEY",
  ],
  utila: [
    "UTILA_NETWORK",
    "UTILA_SERVICE_ACCOUNT_EMAIL",
    "UTILA_SERVICE_ACCOUNT_PRIVATE_KEY_PEM",
    "UTILA_VAULT_ID",
    "UTILA_WALLET_ID",
  ],
  vault: ["VAULT_ADDR", "VAULT_TOKEN", "VAULT_KEY_NAME", "VAULT_PUBLIC_KEY"],
};

export function configuredBackends(): BackendName[] {
  const configured = (
    Object.keys(REQUIRED_ENV) as (keyof typeof REQUIRED_ENV)[]
  ).filter((backend) =>
    REQUIRED_ENV[backend].every((name) => process.env[name])
  );
  return ["memory", ...configured];
}

export async function signerConfigFor(
  backend: BackendName
): Promise<KeychainSignerConfig> {
  switch (backend) {
    case "memory":
      return memoryConfig();
    case "vault":
      return {
        backend,
        keyName: requireEnv("VAULT_KEY_NAME"),
        publicKey: requireEnv("VAULT_PUBLIC_KEY"),
        vaultAddr: requireEnv("VAULT_ADDR"),
        vaultToken: requireEnv("VAULT_TOKEN"),
      };
    case "aws-kms":
      return {
        backend,
        keyId: requireEnv("AWS_KMS_KEY_ID"),
        publicKey: requireEnv("AWS_KMS_PUBLIC_KEY"),
        ...(process.env.AWS_REGION ? { region: process.env.AWS_REGION } : {}),
      };
    case "gcp-kms":
      return {
        backend,
        keyName: requireEnv("GCP_KMS_KEY_NAME"),
        publicKey: requireEnv("GCP_KMS_PUBLIC_KEY"),
      };
    case "turnkey":
      return {
        backend,
        apiPrivateKey: requireEnv("TURNKEY_API_PRIVATE_KEY"),
        apiPublicKey: requireEnv("TURNKEY_API_PUBLIC_KEY"),
        organizationId: requireEnv("TURNKEY_ORGANIZATION_ID"),
        privateKeyId: requireEnv("TURNKEY_PRIVATE_KEY_ID"),
        publicKey: requireEnv("TURNKEY_PUBLIC_KEY"),
      };
    case "privy":
      return {
        backend,
        appId: requireEnv("PRIVY_APP_ID"),
        appSecret: requireEnv("PRIVY_APP_SECRET"),
        walletId: requireEnv("PRIVY_WALLET_ID"),
      };
    case "fireblocks":
      return {
        backend,
        apiKey: requireEnv("FIREBLOCKS_API_KEY"),
        privateKeyPem: normalizePrivateKeyPem(
          requireEnv("FIREBLOCKS_PRIVATE_KEY_PEM")
        ),
        vaultAccountId: requireEnv("FIREBLOCKS_VAULT_ACCOUNT_ID"),
      };
    case "dfns":
      return {
        backend,
        authToken: requireEnv("DFNS_AUTH_TOKEN"),
        credId: requireEnv("DFNS_CRED_ID"),
        privateKeyPem: normalizePrivateKeyPem(
          requireEnv("DFNS_PRIVATE_KEY_PEM")
        ),
        walletId: requireEnv("DFNS_WALLET_ID"),
      };
    case "para":
      return {
        backend,
        apiKey: requireEnv("PARA_API_KEY"),
        walletId: requireEnv("PARA_WALLET_ID"),
      };
    case "cdp":
      return {
        backend,
        address: requireEnv("CDP_ADDRESS"),
        cdpApiKeyId: requireEnv("CDP_API_KEY_ID"),
        cdpApiKeySecret: requireEnv("CDP_API_KEY_SECRET"),
        cdpWalletSecret: requireEnv("CDP_WALLET_SECRET"),
      };
    case "crossmint":
      return {
        backend,
        apiKey: requireEnv("CROSSMINT_API_KEY"),
        walletLocator: requireEnv("CROSSMINT_WALLET_LOCATOR"),
        ...(process.env.CROSSMINT_SIGNER
          ? { signer: process.env.CROSSMINT_SIGNER }
          : {}),
        ...(process.env.CROSSMINT_SIGNER_SECRET
          ? { signerSecret: process.env.CROSSMINT_SIGNER_SECRET }
          : {}),
      };
    case "openfort":
      return {
        backend,
        accountId: requireEnv("OPENFORT_ACCOUNT_ID"),
        secretKey: requireEnv("OPENFORT_SECRET_KEY"),
        walletSecret: requireEnv("OPENFORT_WALLET_SECRET"),
      };
    case "utila":
      return {
        backend,
        network: requireEnv("UTILA_NETWORK"),
        serviceAccountEmail: requireEnv("UTILA_SERVICE_ACCOUNT_EMAIL"),
        serviceAccountPrivateKeyPem: normalizePrivateKeyPem(
          requireEnv("UTILA_SERVICE_ACCOUNT_PRIVATE_KEY_PEM")
        ),
        vaultId: requireEnv("UTILA_VAULT_ID"),
        walletId: requireEnv("UTILA_WALLET_ID"),
      };
  }
}

async function memoryConfig(): Promise<KeychainSignerConfig> {
  if (process.env.MEMORY_PRIVATE_KEY) {
    return {
      backend: "memory",
      privateKeyString: process.env.MEMORY_PRIVATE_KEY,
    };
  }
  if (process.env.MEMORY_KEYPAIR_PATH) {
    return {
      backend: "memory",
      privateKeyPath: process.env.MEMORY_KEYPAIR_PATH,
    };
  }
  console.warn(
    "No MEMORY_PRIVATE_KEY or MEMORY_KEYPAIR_PATH set — using an ephemeral keypair that changes on every restart"
  );
  return { backend: "memory", keyPair: await generateKeyPair() };
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env var ${name}`);
  }
  return value;
}
