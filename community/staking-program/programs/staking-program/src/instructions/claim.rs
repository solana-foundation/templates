use crate::accounts_context::claim::Claim;
use anchor_lang::prelude::*;
use anchor_spl::token::{transfer, Transfer};

pub fn handler(ctx: Context<Claim<'_>>) -> Result<()> {
    let staker = &mut ctx.accounts.staker;

    // Calculate the total rewards to distribute based on the global last_reward_time
    let current_time = Clock::get()?.unix_timestamp;
    let time_elapsed = current_time - ctx.accounts.global_state.last_reward_time;

    let rewards_to_distribute = time_elapsed as u64 * ctx.accounts.global_state.reward_rate;
    let rewards = rewards_to_distribute.min(ctx.accounts.global_state.reward_pool);

    // Calculate the staker's share of the rewards
    let staker_share = (staker.staked_amount as u128 * rewards as u128
        / ctx.accounts.global_state.total_staked as u128) as u64;

    // Transfer the staker's share of rewards
    let seeds: &[&[u8]] = &[b"reward_pool_authority", &[ctx.bumps.reward_pool_authority]];
    let signer_seeds = &[&seeds[..]];

    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.reward_pool.to_account_info(),
            to: ctx.accounts.signer.to_account_info(),
            authority: ctx.accounts.reward_pool_authority.to_account_info(),
        },
        signer_seeds,
    );

    transfer(cpi_ctx, staker_share)?;

    // Update the staker's reward debt
    staker.reward_debt += staker_share;

    msg!("Rewards distributed: {}", staker_share);

    Ok(())
}
