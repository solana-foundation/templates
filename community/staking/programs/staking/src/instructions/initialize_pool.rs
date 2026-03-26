use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};
use anchor_spl::token::{Mint, Token};

use crate::state::StakeConfig;

/// Sets up the staking pool — should be called once by the admin.
/// Creates the reward mint, SOL vault, and config PDA.
#[derive(Accounts)]
pub struct InitPool<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    /// reward / receipt mint — authority is the config PDA
    #[account(
        init,
        payer = admin,
        seeds = [b"token_mint".as_ref()],
        bump,
        mint::decimals = 6,
        mint::authority = config,
    )]
    pub token_mint: Account<'info, Mint>,

    /// SOL vault PDA — holds all staked lamports
    #[account(
        mut,
        seeds = [b"vault".as_ref()],
        bump
    )]
    pub vault: SystemAccount<'info>,

    #[account(
        init,
        payer = admin,
        seeds = [b"config".as_ref()],
        bump,
        space = 8 + StakeConfig::INIT_SPACE,
    )]
    pub config: Account<'info, StakeConfig>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

impl<'info> InitPool<'info> {
    pub fn initialize_pool(
        &mut self,
        rewards_per_stake: u8,
        max_stake: u64,
        freeze_period: i64,
        bumps: &InitPoolBumps,
    ) -> Result<()> {
        // fund vault with rent-exempt minimum so it stays alive on-chain
        let rent = Rent::get()?;
        let vault_lamports = rent.minimum_balance(0);

        let cpi_accounts = Transfer {
            from: self.admin.to_account_info(),
            to: self.vault.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(self.system_program.to_account_info(), cpi_accounts);
        transfer(cpi_ctx, vault_lamports)?;

        self.config.set_inner(StakeConfig {
            rewards_per_stake,
            max_stake,
            freeze_period,
            mint_key: self.token_mint.key(),
            token_mint_bump: bumps.token_mint,
            bump: bumps.config,
        });

        Ok(())
    }
}
