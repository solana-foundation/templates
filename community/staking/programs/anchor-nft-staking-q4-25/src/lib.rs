use anchor_lang::prelude::*;

mod errors;
mod instructions;
mod state;

use instructions::*;

declare_id!("CeaaMUokgzecLqzTnqukBx5T7VsBan7QcJpuWpj4ejfD");

#[program]
pub mod anchor_nft_staking_q4_25 {
    use super::*;

    pub fn initialize_config(
        ctx: Context<InitializeConfig>,
        points_per_stake: u8,
        max_stake: u8,
        freeze_period: u32,
    ) -> Result<()> {
        ctx.accounts
            .initialize_config(points_per_stake, max_stake, freeze_period, &ctx.bumps)
    }

    pub fn initialize_user(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.initialize_user_account(&ctx.bumps)
    }

    pub fn create_collection(
        ctx: Context<CreateCollection>,
        args: CreateCollectionArgs,
    ) -> Result<()> {
        ctx.accounts.create_collection(Box::new(args), &ctx.bumps)
    }

    pub fn mint_nft(ctx: Context<MintNft>) -> Result<()> {
        ctx.accounts.mint_nft()
    }

    pub fn stake(ctx: Context<Stake>) -> Result<()> {
        ctx.accounts.stake(&ctx.bumps)
    }

    pub fn unstake(ctx: Context<Unstake>) -> Result<()> {
        ctx.accounts.unstake()
    }

    pub fn claim(ctx: Context<Claim>) -> Result<()> {
        ctx.accounts.claim()
    }
}
