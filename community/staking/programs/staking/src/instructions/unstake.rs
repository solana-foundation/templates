use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{burn, Burn, Mint, Token, TokenAccount},
};

use crate::{
    errors::StakeError,
    state::{StakeAccount, StakeConfig, UserAccount},
};

#[derive(Accounts)]
#[instruction(id: u64)]
pub struct Unstake<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [b"user".as_ref(), user.key().as_ref()],
        bump,
    )]
    pub user_account: Account<'info, UserAccount>,

    #[account(
        mut,
        close = user,
        seeds = [b"stake".as_ref(), user.key().as_ref(), id.to_le_bytes().as_ref()],
        bump
    )]
    pub stake_account: Account<'info, StakeAccount>,

    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = user,
        associated_token::token_program = token_program,
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [b"token_mint".as_ref()],
        bump,
    )]
    pub token_mint: Account<'info, Mint>,

    #[account(
        mut,
        seeds = [b"vault".as_ref()],
        bump
    )]
    pub vault: SystemAccount<'info>,

    #[account(
        seeds = [b"config".as_ref()],
        bump = config.bump
    )]
    pub config: Account<'info, StakeConfig>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

impl<'info> Unstake<'info> {
    pub fn unstake(&mut self, bumps: &UnstakeBumps) -> Result<()> {
        let clock = Clock::get()?;
        let time_elapsed = clock.unix_timestamp - self.stake_account.staked_at;

        require!(
            time_elapsed >= self.config.freeze_period,
            StakeError::FreezePeriodNotPassed
        );

        // 1. Calculate Rewards (Time is already in seconds)
        let staked_amount = self.stake_account.amount;
        let rewards_for_stake = staked_amount * (self.config.rewards_per_stake as u64);
        let total_rewards = rewards_for_stake * (time_elapsed as u64);

        // 2. Burn the tokens from the user (Optional but recommended)
        let cpi_accounts = Burn {
            from: self.user_token_account.to_account_info(),
            mint: self.token_mint.to_account_info(),
            authority: self.user.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(self.token_program.to_account_info(), cpi_accounts);

        burn(cpi_ctx, staked_amount)?;

        // 3. Transfer SOL from Vault to User using PDA Seeds
        let signer_seeds: &[&[&[u8]]] = &[&[b"vault".as_ref(), &[bumps.vault]]];

        let cpi_accounts = Transfer {
            from: self.vault.to_account_info(),
            to: self.user.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            self.system_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );
        transfer(cpi_ctx, staked_amount)?;

        // 4. Update State
        self.user_account.amount_staked -= staked_amount;
        self.user_account.accumulated_rewards += total_rewards;

        Ok(())
    }
}
