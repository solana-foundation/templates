use std::env;
use anyhow::{Context, Result};

#[derive(Clone, Debug)]
pub struct Config {
    pub receiver_address: String,
    pub facilitator_url: String,
    pub solana_network: String,
    pub solana_rpc_url: String,
    pub usdc_mint: String,
    pub default_price: u64,
    pub host: String,
    pub port: u16,
}

impl Config {
    pub fn from_env() -> Result<Self> {
        // Load .env file if it exists
        dotenv::dotenv().ok();

        Ok(Self {
            // Required fields
            receiver_address: env::var("RECEIVER_WALLET_ADDRESS")
                .context("RECEIVER_WALLET_ADDRESS must be set in .env")?,

            // Optionals with default
            facilitator_url: env::var("FACILITATOR_URL")
                .unwrap_or_else(|_| "https://facilitator.payai.network".to_string()),

            solana_network: env::var("SOLANA_NETWORK")
                .unwrap_or_else(|_| "solana-devnet".to_string()),

            solana_rpc_url: env::var("SOLANA_RPC_URL")
                .unwrap_or_else(|_| "https://api.devnet.solana.com".to_string()),

            usdc_mint: env::var("USDC_MINT_ADDRESS")
                .unwrap_or_else(|_| {
                    // Devnet USDC by default
                    "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU".to_string()
                }),

            default_price: env::var("DEFAULT_PRICE")
                .unwrap_or_else(|_| "10000".to_string())
                .parse()
                .context("DEFAULT_PRICE must be a valid number")?,

            host: env::var("HOST")
                .unwrap_or_else(|_| "localhost".to_string()),

            port: env::var("PORT")
                .unwrap_or_else(|_| "3000".to_string())
                .parse()
                .context("PORT must be a valid number")?,
        })
    }

    pub fn server_address(&self) -> String {
        format!("{}:{}", self.host, self.port)
    }
}