use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};

use crate::{errors::StakeError, state::UserAccount};

/// Pays out accumulated rewards from the vault.
/// Only the account owner can claim.
#[derive(Accounts)]
pub struct Claim<'info> {
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
        seeds = [b"vault".as_ref()],
        bump
    )]
    pub vault: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> Claim<'info> {
    pub fn claim(&mut self, amount: u64, bumps: &ClaimBumps) -> Result<()> {
        require!(
            self.user_account.accumulated_rewards >= amount,
            StakeError::ClaimExceeded
        );
        require!(
            self.user_account.owner == self.user.key(),
            StakeError::InvalidClaim
        );

        // send SOL from vault to user — vault is a PDA so we sign with its seeds
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
        transfer(cpi_ctx, amount)?;

        // debit so they can't claim the same rewards twice
        self.user_account.accumulated_rewards -= amount;

        Ok(())
    }
}
