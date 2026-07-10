import {
  normalizePrivateKeyPem,
  type BackendName,
  type KeychainSignerConfig,
} from "@solana/keychain";
import { generateKeyPair } from "@solana/kit";

const BACKEND_ENV: Record<
  Exclude<BackendName, "memory">,
  Record<string, string>
> = {
  "aws-kms": {
    keyId: "AWS_KMS_KEY_ID",
    publicKey: "AWS_KMS_PUBLIC_KEY",
    region: "AWS_REGION",
  },
  cdp: {
    address: "CDP_ADDRESS",
    cdpApiKeyId: "CDP_API_KEY_ID",
    cdpApiKeySecret: "CDP_API_KEY_SECRET",
    cdpWalletSecret: "CDP_WALLET_SECRET",
  },
  crossmint: {
    apiKey: "CROSSMINT_API_KEY",
    walletLocator: "CROSSMINT_WALLET_LOCATOR",
    signer: "CROSSMINT_SIGNER",
    signerSecret: "CROSSMINT_SIGNER_SECRET",
  },
  dfns: {
    authToken: "DFNS_AUTH_TOKEN",
    credId: "DFNS_CRED_ID",
    privateKeyPem: "DFNS_PRIVATE_KEY_PEM",
    walletId: "DFNS_WALLET_ID",
  },
  fireblocks: {
    apiKey: "FIREBLOCKS_API_KEY",
    privateKeyPem: "FIREBLOCKS_PRIVATE_KEY_PEM",
    vaultAccountId: "FIREBLOCKS_VAULT_ACCOUNT_ID",
  },
  "gcp-kms": {
    keyName: "GCP_KMS_KEY_NAME",
    publicKey: "GCP_KMS_PUBLIC_KEY",
  },
  openfort: {
    accountId: "OPENFORT_ACCOUNT_ID",
    secretKey: "OPENFORT_SECRET_KEY",
    walletSecret: "OPENFORT_WALLET_SECRET",
  },
  para: {
    apiKey: "PARA_API_KEY",
    walletId: "PARA_WALLET_ID",
  },
  privy: {
    appId: "PRIVY_APP_ID",
    appSecret: "PRIVY_APP_SECRET",
    walletId: "PRIVY_WALLET_ID",
  },
  turnkey: {
    apiPrivateKey: "TURNKEY_API_PRIVATE_KEY",
    apiPublicKey: "TURNKEY_API_PUBLIC_KEY",
    organizationId: "TURNKEY_ORGANIZATION_ID",
    privateKeyId: "TURNKEY_PRIVATE_KEY_ID",
    publicKey: "TURNKEY_PUBLIC_KEY",
  },
  utila: {
    network: "UTILA_NETWORK",
    serviceAccountEmail: "UTILA_SERVICE_ACCOUNT_EMAIL",
    serviceAccountPrivateKeyPem: "UTILA_SERVICE_ACCOUNT_PRIVATE_KEY_PEM",
    vaultId: "UTILA_VAULT_ID",
    walletId: "UTILA_WALLET_ID",
  },
  vault: {
    keyName: "VAULT_KEY_NAME",
    publicKey: "VAULT_PUBLIC_KEY",
    vaultAddr: "VAULT_ADDR",
    vaultToken: "VAULT_TOKEN",
  },
};

const OPTIONAL_ENV = new Set([
  "AWS_REGION",
  "CROSSMINT_SIGNER",
  "CROSSMINT_SIGNER_SECRET",
]);

const PEM_FIELDS = new Set(["privateKeyPem", "serviceAccountPrivateKeyPem"]);

export function configuredBackends(): BackendName[] {
  const configured = (
    Object.keys(BACKEND_ENV) as (keyof typeof BACKEND_ENV)[]
  ).filter((backend) =>
    Object.values(BACKEND_ENV[backend]).every(
      (name) => OPTIONAL_ENV.has(name) || process.env[name]
    )
  );
  return ["memory", ...configured];
}

export async function signerConfigFor(
  backend: BackendName
): Promise<KeychainSignerConfig> {
  if (backend === "memory") {
    return memoryConfig();
  }
  const params: Record<string, string> = {};
  for (const [field, name] of Object.entries(BACKEND_ENV[backend])) {
    const value = process.env[name];
    if (!value) {
      if (OPTIONAL_ENV.has(name)) continue;
      throw new Error(
        `Missing env var ${name} (required by backend ${backend})`
      );
    }
    params[field] = PEM_FIELDS.has(field)
      ? normalizePrivateKeyPem(value)
      : value;
  }
  return { backend, ...params } as KeychainSignerConfig;
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
