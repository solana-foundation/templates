use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, Token, TokenAccount, Transfer},
};

use crate::{
    error::StakeError, 
    state::StakeAccount, 
    utils::update_point
};

#[derive(Accounts)]
pub struct ClaimReward<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"client1", signer.key().as_ref()],
        bump = stake_account.bump,
        has_one = signer @ StakeError::Unauthorized 
    )]
    pub stake_account: Account<'info, StakeAccount>,
    pub reward_mint: Account<'info, Mint>,
    #[account(
        mut,
        associated_token::mint = reward_mint,
        associated_token::authority = signer
    )]
    pub user_reward_account: Account<'info, TokenAccount>,

    /// CHECK: The protocol's vault that holds the reward tokens
    #[account(
        mut,
        seeds = [b"reward_vault", reward_mint.key().as_ref()],
        bump
    )]
    pub reward_vault: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}
impl<'info> ClaimReward<'info> {
    pub fn claim_reward(&mut self, vault_bump: u8) -> Result<()> {
        // 1. Update the user's points to the current exact second
        let stake_account = &mut self.stake_account;
        let clock = Clock::get()?;
        update_point(stake_account, clock.unix_timestamp)?;

        // 2. Calculate the claimable token amount: 1_000_000 points = 1 token unit
        let mut claimable_amount = stake_account
            .point
            .checked_div(1_000_000)
            .ok_or(StakeError::Overflow)?;

        // If the user has non-zero points but rounding would give 0, grant 1 unit
        if claimable_amount == 0 && stake_account.point > 0 {
            claimable_amount = 1;
        }

        // Optional: Prevent the transaction from costing gas if there's truly nothing to claim
        require!(claimable_amount > 0, StakeError::InvalidAmount);

        // 3. Transfer the reward tokens from the protocol vault to the user
        let reward_mint_key = self.reward_mint.key();
        let vault_seeds = &[
            b"reward_vault".as_ref(),
            reward_mint_key.as_ref(),
            &[vault_bump],
        ];
        let signer_seeds = &[&vault_seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(
            self.token_program.to_account_info(),
            Transfer {
                from: self.reward_vault.to_account_info(),
                to: self.user_reward_account.to_account_info(),
                authority: self.reward_vault.to_account_info(),
            },
            signer_seeds,
        );

        token::transfer(cpi_ctx, claimable_amount)?;

        // 4. Deduct the claimed points while preserving fractional remainder.
        // Use saturating_mul then min() so we never subtract more points than exist
        // (handles the rounding-up fallback where claimable_amount=1 but points < 1_000_000).
        let points_deducted = claimable_amount
            .saturating_mul(1_000_000)
            .min(stake_account.point);
        stake_account.point = stake_account.point.saturating_sub(points_deducted);

        Ok(())
    }
}