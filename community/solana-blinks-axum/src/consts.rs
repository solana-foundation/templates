use solana_sdk::pubkey::Pubkey;
use std::sync::LazyLock;

pub const DEFAULT_RPC_URL: &str = "https://api.mainnet-beta.solana.com";
pub const DEFAULT_HOST: &str = "0.0.0.0";
pub const DEFAULT_PORT: &str = "3000";

pub const SOLANA_LOGO_URL: &str = "https://solana.com/src/img/branding/solanaLogoMark.svg";

pub use solana_sdk::fee_calculator::DEFAULT_TARGET_LAMPORTS_PER_SIGNATURE as LAMPORTS_PER_SIGNATURE;

pub const CHAIN_PARAM: &str = "_chain";

pub static MEMO_PROGRAM_ID: LazyLock<Pubkey> = LazyLock::new(|| {
    "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
        .parse()
        .expect("hardcoded memo program ID is valid")
});

pub static DONATE_TREASURY: LazyLock<Pubkey> = LazyLock::new(|| {
    "DAw5ebjQBFruAFb7aehTTdbWixeTS3oS1BUAiZtKAvea"
        .parse()
        .expect("hardcoded treasury address is valid")
});
