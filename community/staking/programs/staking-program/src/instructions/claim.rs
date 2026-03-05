use crate::accounts_context::claim::Claim;
use crate::error::CustomError;
use anchor_lang::prelude::*;
use anchor_spl::token::{transfer, Transfer};

pub fn handler(ctx: Context<Claim<'_>>) -> Result<()> {
    let staker = &mut ctx.accounts.staker;
    let global_state = &mut ctx.accounts.global_state;

    require!(staker.staked_amount > 0, CustomError::NoStakePosition);
    require_keys_eq!(
        staker.address,
        ctx.accounts.signer.key(),
        CustomError::InvalidOperation
    );
    require!(global_state.total_staked > 0, CustomError::InvalidOperation);
    require!(global_state.reward_pool > 0, CustomError::EmptyRewardPool);

    let current_time = Clock::get()?.unix_timestamp;
    require!(
        current_time >= global_state.last_reward_time,
        CustomError::InvalidOperation
    );

    let time_elapsed = (current_time - global_state.last_reward_time) as u64;
    require!(
        time_elapsed > 0 && global_state.reward_rate > 0,
        CustomError::NoRewardsAvailable
    );

    let rewards_to_distribute = time_elapsed
        .checked_mul(global_state.reward_rate)
        .ok_or(CustomError::MathOverflow)?;
    let rewards = rewards_to_distribute.min(global_state.reward_pool);
    require!(rewards > 0, CustomError::NoRewardsAvailable);

    // Calculate the staker's share of the rewards
    let staker_share_u128 =
        (staker.staked_amount as u128 * rewards as u128) / global_state.total_staked as u128;
    let staker_share =
        u64::try_from(staker_share_u128).map_err(|_| error!(CustomError::MathOverflow))?;
    require!(staker_share > 0, CustomError::NoRewardsAvailable);

    // Transfer the staker's share of rewards
    let seeds: &[&[u8]] = &[b"reward_pool_authority", &[ctx.bumps.reward_pool_authority]];
    let signer_seeds = &[&seeds[..]];

    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.reward_pool.to_account_info(),
            to: ctx.accounts.user_reward_token_account.to_account_info(),
            authority: ctx.accounts.reward_pool_authority.to_account_info(),
        },
        signer_seeds,
    );

    transfer(cpi_ctx, staker_share)?;

    // Update the staker's reward debt
    staker.reward_debt = staker
        .reward_debt
        .checked_add(staker_share)
        .ok_or(CustomError::MathOverflow)?;
    global_state.reward_pool = global_state
        .reward_pool
        .checked_sub(staker_share)
        .ok_or(CustomError::MathOverflow)?;
    global_state.last_reward_time = current_time;

    msg!("Rewards distributed: {}", staker_share);

    Ok(())
}
