use anchor_lang::prelude::*;
pub mod accounts_context;
pub mod error;
pub mod instructions;
pub mod state;

use crate::accounts_context::*;

declare_id!("55UVMV1TKf7qMeY66xffEeTzom9BSt6oeaoVQMZkZXCp");

#[program]
pub mod staking_program {

    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        crate::instructions::initialize::handler(ctx)
    }

    pub fn stake(ctx: Context<Stake>, amount: u64) -> Result<()> {
        crate::instructions::stake::handler(ctx, amount)
    }

    pub fn unstake(ctx: Context<Unstake>, amount: u64) -> Result<()> {
        crate::instructions::unstake::handler(ctx, amount)
    }

    pub fn claim(ctx: Context<Claim>) -> Result<()> {
        crate::instructions::claim::handler(ctx)
    }

    pub fn add_rewards(ctx: Context<AddRewards>, amount: u64, reward_rate: u64) -> Result<()> {
        crate::instructions::add_rewards::handler(ctx, amount, reward_rate)
    }
}
