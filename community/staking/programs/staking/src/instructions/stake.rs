use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{mint_to, Mint, MintTo, Token, TokenAccount},
};

use crate::{
    errors::StakeError,
    state::{StakeAccount, StakeConfig, UserAccount},
};

/// Locks SOL in the vault and mints receipt tokens to the user.
/// A unique `id` allows a user to have multiple concurrent stakes.
#[derive(Accounts)]
#[instruction(id: u64)]
pub struct Stake<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    /// created on first stake, reused on subsequent ones
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + UserAccount::INIT_SPACE,
        seeds = [b"user".as_ref(), user.key().as_ref()],
        bump,
    )]
    pub user_account: Account<'info, UserAccount>,

    /// one per stake — seed includes `id` so users can stake multiple times
    #[account(
        init,
        payer = user,
        space = 8 + StakeAccount::INIT_SPACE,
        seeds = [b"stake".as_ref(), user.key().as_ref(), id.to_le_bytes().as_ref()],
        bump
    )]
    pub stake_account: Account<'info, StakeAccount>,

    #[account(
        init_if_needed,
        payer = user,
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

impl<'info> Stake<'info> {
    pub fn stake(&mut self, amount: u64, bumps: &StakeBumps) -> Result<()> {
        // reject zero-amount stakes (they'd earn time-based rewards for free)
        require!(amount > 0, StakeError::ZeroStakeAmount);

        // enforce per-user cap
        require!(
            self.user_account.amount_staked + amount <= self.config.max_stake,
            StakeError::StakeOverflow
        );

        // first-time setup for this wallet
        if !self.user_account.is_initialized {
            self.user_account.set_inner(UserAccount {
                owner: self.user.key(),
                accumulated_rewards: 0,
                claimed_rewards: 0,
                amount_staked: amount,
                is_initialized: true,
                bump: bumps.user_account,
            });
        } else {
            // subsequent stakes: keep the running total up to date
            self.user_account.amount_staked += amount;
        }

        self.stake_account.set_inner(StakeAccount {
            owner: self.user.key(),
            amount,
            staked_at: Clock::get()?.unix_timestamp,
            bump: bumps.stake_account,
        });

        // move SOL into the vault
        let cpi_accounts = Transfer {
            from: self.user.to_account_info(),
            to: self.vault.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(self.system_program.to_account_info(), cpi_accounts);

        transfer(cpi_ctx, amount)?;
        // mint receipt tokens 1:1 with staked lamports
        self.mint(amount)?;

        Ok(())
    }

    /// helper: mint receipt SPL tokens to the user's ATA
    /// uses config PDA as signer since it's the mint authority
    pub fn mint(&mut self, amount: u64) -> Result<()> {
        let signer_seeds: &[&[&[u8]]] = &[&[b"config".as_ref(), &[self.config.bump]]];

        let cpi_accounts = MintTo {
            mint: self.token_mint.to_account_info(),
            to: self.user_token_account.to_account_info(),
            authority: self.config.to_account_info(),
        };

        let cpi_ctx = CpiContext::new_with_signer(
            self.token_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );

        mint_to(cpi_ctx, amount)
    }
}
