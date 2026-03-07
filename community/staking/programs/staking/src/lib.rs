//! SOL staking program — users lock SOL, receive SPL receipt tokens,
//! and earn time-based rewards they can claim later.

use anchor_lang::prelude::*;

mod errors;
mod instructions;
mod state;

use instructions::*;

declare_id!("RyFaKyDtxWbmN2ffdgHBdASic8kGhREJEGVQiDmm6aT");

/// Entrypoint handlers — thin wrappers that delegate to each instruction module.
#[program]
pub mod staking_template {
    use super::*;

    pub fn initialize_pool(
        ctx: Context<InitPool>,
        rewards_per_stake: u8,
        max_stake: u64,
        freeze_period: i64,
    ) -> Result<()> {
        ctx.accounts
            .initialize_pool(rewards_per_stake, max_stake, freeze_period, &ctx.bumps)
    }

    pub fn stake(ctx: Context<Stake>, _id: u64, amount: u64) -> Result<()> {
        ctx.accounts.stake(amount, &ctx.bumps)
    }

    pub fn unstake(ctx: Context<Unstake>, _id: u64) -> Result<()> {
        ctx.accounts.unstake(&ctx.bumps)
    }

    pub fn claim(ctx: Context<Claim>, amount: u64) -> Result<()> {
        ctx.accounts.claim(amount, &ctx.bumps)
    }
}
