use anchor_lang::prelude::*;
pub mod instructions;
pub use instructions::*;
pub mod state;
pub use state::*;
pub mod utils;
pub use utils::*;
pub mod error;

declare_id!("2sDmukdwTwveGdNoY46TCQ7v9LpbN3zQzaX9RANWTjfF");

#[allow(deprecated)]
#[program]
pub mod staking {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, seed: u64) -> Result<()> {
        ctx.accounts.initialize(seed, &ctx.bumps)
    }

    pub fn stake(ctx: Context<Stake>, amount: u64) -> Result<()> {
        let mint_auth_bump = ctx.bumps.mint_authority;
        ctx.accounts.stake(amount, mint_auth_bump)
    }

    pub fn unstake(ctx: Context<Unstake>, amount: u64) -> Result<()> {
        let vault_bump = ctx.bumps.vault;
        ctx.accounts.unstake(amount, vault_bump)
    }

    pub fn claim_reward(ctx: Context<ClaimReward>) -> Result<()> {
        ctx.accounts.claim_reward(ctx.bumps.reward_vault)
    }

    pub fn initialize_pool(ctx: Context<InitializePool>, reward_rate: u64) -> Result<()> {
        ctx.accounts.handle_initialize_pool(reward_rate, ctx.bumps.pool_state)
    }

    pub fn fund_reward_vault(ctx: Context<FundRewardVault>, amount: u64) -> Result<()> {
         ctx.accounts.handle_fund_reward_vault(amount)   
    }
}
