import {
  normalizePrivateKeyPem,
  type KeychainSignerConfig,
} from "@solana/keychain";
import { generateKeyPair } from "@solana/kit";

export async function signerConfigFromEnv(): Promise<KeychainSignerConfig> {
  const backend = process.env.KEYCHAIN_BACKEND ?? "memory";
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
    default:
      throw new Error(
        `Unknown KEYCHAIN_BACKEND "${backend}". Valid backends: memory, vault, aws-kms, gcp-kms, turnkey, privy, fireblocks, dfns, para, cdp, crossmint, openfort, utila`
      );
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
    throw new Error(
      `Missing env var ${name} (required by KEYCHAIN_BACKEND=${process.env.KEYCHAIN_BACKEND})`
    );
  }
  return value;
}
