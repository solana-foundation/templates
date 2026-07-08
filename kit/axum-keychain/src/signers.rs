use std::env;

use solana_keychain::vault::{reqwest, VaultSigner};
use solana_keychain::Signer;
use solana_sdk::signer::keypair::Keypair;

pub type Registry = Vec<(String, Result<Signer, String>)>;

const VAULT_REQUIRED_ENV: [&str; 4] = [
    "VAULT_ADDR",
    "VAULT_TOKEN",
    "VAULT_KEY_NAME",
    "VAULT_PUBLIC_KEY",
];

pub fn build() -> Registry {
    let mut registry: Registry = vec![(
        "memory".to_string(),
        memory_signer().map_err(|e| e.to_string()),
    )];
    if VAULT_REQUIRED_ENV.iter().all(|v| env::var(v).is_ok()) {
        registry.push((
            "vault".to_string(),
            vault_signer().map_err(|e| e.to_string()),
        ));
    }
    registry
}

fn memory_signer() -> Result<Signer, solana_keychain::SignerError> {
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

fn vault_signer() -> Result<Signer, solana_keychain::SignerError> {
    let vault_addr = env::var("VAULT_ADDR").expect("checked");
    let vault_token = env::var("VAULT_TOKEN").expect("checked");
    let key_name = env::var("VAULT_KEY_NAME").expect("checked");
    let pubkey = env::var("VAULT_PUBLIC_KEY").expect("checked");

    if env::var("VAULT_ALLOW_HTTP").as_deref() == Ok("true") {
        let client = reqwest::Client::builder().build().map_err(|e| {
            solana_keychain::SignerError::ConfigError(format!("Failed to build HTTP client: {e}"))
        })?;
        return Ok(Signer::Vault(VaultSigner::with_client(
            client,
            vault_addr,
            vault_token,
            key_name,
            pubkey,
        )?));
    }
    Signer::from_vault(vault_addr, vault_token, key_name, pubkey, None)
}
