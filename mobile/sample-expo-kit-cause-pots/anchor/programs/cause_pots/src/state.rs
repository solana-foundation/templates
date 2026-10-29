use anchor_lang::prelude::*;

use crate::constants::*;

#[account]
#[derive(InitSpace)]
pub struct Pot {
    /// Creator of the pot; the only account that can add contributors and release funds.
    pub authority: Pubkey,
    /// Vault PDA that holds the pooled SOL.
    pub vault: Pubkey,
    #[max_len(MAX_NAME_LENGTH)]
    pub name: String,
    #[max_len(MAX_DESCRIPTION_LENGTH)]
    pub description: String,
    pub category: PotCategory,
    pub currency: Currency,
    /// Savings target in lamports.
    pub target_amount: u64,
    pub total_contributed: u64,
    /// Release becomes possible once the cluster clock passes this timestamp.
    pub unlock_timestamp: i64,
    /// How many contributor signatures a release requires.
    pub signers_required: u8,
    /// Contributors that have approved the release. Each contributor can sign
    /// once, so this never grows past the contributor list.
    #[max_len(MAX_CONTRIBUTORS)]
    pub signatures: Vec<Pubkey>,
    #[max_len(MAX_CONTRIBUTORS)]
    pub contributors: Vec<Pubkey>,
    pub is_released: bool,
    pub released_at: Option<i64>,
    pub recipient: Option<Pubkey>,
    pub created_at: i64,
    pub bump: u8,
    pub vault_bump: u8,
}

/// Category shown in the app, stored on-chain so every contributor sees the same pot.
#[derive(AnchorDeserialize, AnchorSerialize, Clone, Copy, Eq, InitSpace, PartialEq)]
pub enum PotCategory {
    Goal,
    Emergency,
    Bills,
    Events,
    Others,
}

/// Display unit for amounts. Contributions always move SOL; `Usd` only changes
/// how the app renders the numbers.
#[derive(AnchorDeserialize, AnchorSerialize, Clone, Copy, Eq, InitSpace, PartialEq)]
pub enum Currency {
    Sol,
    Usd,
}

#[account]
#[derive(InitSpace)]
pub struct Contributor {
    pub pot: Pubkey,
    pub contributor: Pubkey,
    pub total_contributed: u64,
    pub contribution_count: u32,
    pub last_contribution_at: i64,
    pub joined_at: i64,
    pub bump: u8,
}
