use std::env;

use solana_keychain::crossmint::CrossmintSignerConfig;
use solana_keychain::dfns::DfnsSignerConfig;
use solana_keychain::fireblocks::FireblocksSignerConfig;
use solana_keychain::utila::UtilaSignerConfig;
use solana_keychain::vault::{reqwest, VaultSigner};
use solana_keychain::{Signer, SignerError};
use solana_sdk::signer::keypair::Keypair;

pub type Registry = Vec<(String, Result<Signer, String>)>;

const BACKENDS: [(&str, &[&str]); 12] = [
    (
        "vault",
        &[
            "VAULT_ADDR",
            "VAULT_TOKEN",
            "VAULT_KEY_NAME",
            "VAULT_PUBLIC_KEY",
        ],
    ),
    ("aws-kms", &["AWS_KMS_KEY_ID", "AWS_KMS_PUBLIC_KEY"]),
    ("gcp-kms", &["GCP_KMS_KEY_NAME", "GCP_KMS_PUBLIC_KEY"]),
    (
        "turnkey",
        &[
            "TURNKEY_API_PRIVATE_KEY",
            "TURNKEY_API_PUBLIC_KEY",
            "TURNKEY_ORGANIZATION_ID",
            "TURNKEY_PRIVATE_KEY_ID",
            "TURNKEY_PUBLIC_KEY",
        ],
    ),
    (
        "privy",
        &["PRIVY_APP_ID", "PRIVY_APP_SECRET", "PRIVY_WALLET_ID"],
    ),
    (
        "fireblocks",
        &[
            "FIREBLOCKS_API_KEY",
            "FIREBLOCKS_PRIVATE_KEY_PEM",
            "FIREBLOCKS_VAULT_ACCOUNT_ID",
        ],
    ),
    (
        "dfns",
        &[
            "DFNS_AUTH_TOKEN",
            "DFNS_CRED_ID",
            "DFNS_PRIVATE_KEY_PEM",
            "DFNS_WALLET_ID",
        ],
    ),
    ("para", &["PARA_API_KEY", "PARA_WALLET_ID"]),
    (
        "cdp",
        &[
            "CDP_ADDRESS",
            "CDP_API_KEY_ID",
            "CDP_API_KEY_SECRET",
            "CDP_WALLET_SECRET",
        ],
    ),
    (
        "crossmint",
        &["CROSSMINT_API_KEY", "CROSSMINT_WALLET_LOCATOR"],
    ),
    (
        "openfort",
        &[
            "OPENFORT_ACCOUNT_ID",
            "OPENFORT_SECRET_KEY",
            "OPENFORT_WALLET_SECRET",
        ],
    ),
    (
        "utila",
        &[
            "UTILA_NETWORK",
            "UTILA_SERVICE_ACCOUNT_EMAIL",
            "UTILA_SERVICE_ACCOUNT_PRIVATE_KEY_PEM",
            "UTILA_VAULT_ID",
            "UTILA_WALLET_ID",
        ],
    ),
];

pub async fn build() -> Registry {
    let mut registry: Registry = vec![(
        "memory".to_string(),
        memory_signer().map_err(|e| e.to_string()),
    )];
    for (backend, required) in BACKENDS {
        if required.iter().all(|name| env::var(name).is_ok()) {
            registry.push((
                backend.to_string(),
                construct(backend).await.map_err(|e| e.to_string()),
            ));
        }
    }
    registry
}

async fn construct(backend: &str) -> Result<Signer, SignerError> {
    match backend {
        "vault" => vault_signer(),
        "aws-kms" => {
            Signer::from_aws_kms(
                req("AWS_KMS_KEY_ID"),
                req("AWS_KMS_PUBLIC_KEY"),
                env::var("AWS_REGION").ok(),
            )
            .await
        }
        "gcp-kms" => Signer::from_gcp_kms(req("GCP_KMS_KEY_NAME"), req("GCP_KMS_PUBLIC_KEY")).await,
        "turnkey" => Signer::from_turnkey(
            req("TURNKEY_API_PUBLIC_KEY"),
            req("TURNKEY_API_PRIVATE_KEY"),
            req("TURNKEY_ORGANIZATION_ID"),
            req("TURNKEY_PRIVATE_KEY_ID"),
            req("TURNKEY_PUBLIC_KEY"),
            None,
        ),
        "privy" => {
            Signer::from_privy(
                req("PRIVY_APP_ID"),
                req("PRIVY_APP_SECRET"),
                req("PRIVY_WALLET_ID"),
                None,
            )
            .await
        }
        "fireblocks" => {
            Signer::from_fireblocks(FireblocksSignerConfig {
                api_key: req("FIREBLOCKS_API_KEY"),
                private_key_pem: pem("FIREBLOCKS_PRIVATE_KEY_PEM"),
                vault_account_id: req("FIREBLOCKS_VAULT_ACCOUNT_ID"),
                asset_id: None,
                api_base_url: None,
                poll_interval_ms: None,
                max_poll_attempts: None,
                use_program_call: None,
                http_client_config: None,
            })
            .await
        }
        "dfns" => {
            Signer::from_dfns(DfnsSignerConfig {
                auth_token: req("DFNS_AUTH_TOKEN"),
                cred_id: req("DFNS_CRED_ID"),
                private_key_pem: pem("DFNS_PRIVATE_KEY_PEM"),
                wallet_id: req("DFNS_WALLET_ID"),
                api_base_url: None,
                http_client_config: None,
            })
            .await
        }
        "para" => Signer::from_para(req("PARA_API_KEY"), req("PARA_WALLET_ID"), None).await,
        "cdp" => Signer::from_cdp(
            req("CDP_API_KEY_ID"),
            req("CDP_API_KEY_SECRET"),
            req("CDP_WALLET_SECRET"),
            req("CDP_ADDRESS"),
            None,
        ),
        "crossmint" => {
            Signer::from_crossmint(CrossmintSignerConfig {
                api_key: req("CROSSMINT_API_KEY"),
                wallet_locator: req("CROSSMINT_WALLET_LOCATOR"),
                signer: env::var("CROSSMINT_SIGNER").ok(),
                signer_secret: env::var("CROSSMINT_SIGNER_SECRET").ok(),
                api_base_url: None,
                poll_interval_ms: None,
                max_poll_attempts: None,
            })
            .await
        }
        "openfort" => {
            Signer::from_openfort(
                req("OPENFORT_SECRET_KEY"),
                req("OPENFORT_ACCOUNT_ID"),
                req("OPENFORT_WALLET_SECRET"),
                None,
            )
            .await
        }
        "utila" => {
            Signer::from_utila(UtilaSignerConfig {
                service_account_email: req("UTILA_SERVICE_ACCOUNT_EMAIL"),
                service_account_private_key_pem: pem("UTILA_SERVICE_ACCOUNT_PRIVATE_KEY_PEM"),
                vault_id: req("UTILA_VAULT_ID"),
                wallet_id: req("UTILA_WALLET_ID"),
                network: req("UTILA_NETWORK"),
                api_base_url: None,
                poll_interval_ms: None,
                max_poll_attempts: None,
                designated_signers: None,
                http_client_config: None,
            })
            .await
        }
        _ => unreachable!("unknown backend {backend}"),
    }
}

fn memory_signer() -> Result<Signer, SignerError> {
    if let Ok(private_key) = env::var("MEMORY_PRIVATE_KEY") {
        return Signer::from_memory(&private_key);
    }
    if let Ok(path) = env::var("MEMORY_KEYPAIR_PATH") {
        return Signer::from_memory_file(&path);
    }
    eprintln!(
        "No MEMORY_PRIVATE_KEY or MEMORY_KEYPAIR_PATH set — using an ephemeral keypair that changes on every restart"
    );
    Signer::from_memory(&Keypair::new().to_base58_string())
}

fn vault_signer() -> Result<Signer, SignerError> {
    if env::var("VAULT_ALLOW_HTTP").as_deref() == Ok("true") {
        let client = reqwest::Client::builder()
            .build()
            .map_err(|e| SignerError::ConfigError(format!("Failed to build HTTP client: {e}")))?;
        return Ok(Signer::Vault(VaultSigner::with_client(
            client,
            req("VAULT_ADDR"),
            req("VAULT_TOKEN"),
            req("VAULT_KEY_NAME"),
            req("VAULT_PUBLIC_KEY"),
        )?));
    }
    Signer::from_vault(
        req("VAULT_ADDR"),
        req("VAULT_TOKEN"),
        req("VAULT_KEY_NAME"),
        req("VAULT_PUBLIC_KEY"),
        None,
    )
}

fn req(name: &str) -> String {
    env::var(name).expect("required env presence is checked before construction")
}

fn pem(name: &str) -> String {
    req(name).replace("\\n", "\n")
}
