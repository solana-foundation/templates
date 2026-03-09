use anchor_lang::{prelude::*, system_program};
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Burn, Mint, Token, TokenAccount},
};


use crate::{
    error::StakeError, 
    state::StakeAccount,
    PoolState,
    utils::update_point 
};

#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"client1", signer.key().as_ref()],
        bump = stake_account.bump,
        has_one = signer @ StakeError::Unauthorized 
    )]
    pub stake_account: Account<'info, StakeAccount>,

    #[account(
        mut,
        seeds = [b"pool_state", reward_mint.key().as_ref()],
        bump = pool_state.bump,
        has_one = reward_mint @ StakeError::Unauthorized
    )]
    pub pool_state: Account<'info, PoolState>,

    pub reward_mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub mint_account: Account<'info, Mint>,
    
    #[account(
        mut,
        associated_token::mint = mint_account,
        associated_token::authority = signer
    )]
    pub associated_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    
    /// CHECK: This is a PDA that holds the staked SOL
    #[account(
        mut,
        seeds = [b"vault", signer.key().as_ref()],
        bump
    )]
    pub vault: SystemAccount<'info>,
    
    pub system_program: Program<'info, System>,
}
impl<'info> Unstake<'info> {
    pub fn unstake(&mut self, amount: u64, vault_bump: u8) -> Result<()> {
        require!(amount > 0, StakeError::InvalidAmount);
        require!(self.stake_account.staked_amount >= amount, StakeError::InvalidAmount);

        // 1. Update points before changing the staked balance
        let clock = Clock::get()?;
        update_point(&mut self.stake_account, clock.unix_timestamp)?;

        // 2. Transfer SOL from vault PDA back to the signer
        let signer_key = self.signer.key();
        let vault_seeds = &[b"vault", signer_key.as_ref(), &[vault_bump]];
        let signer_seeds = &[&vault_seeds[..]];

        let cpi_context = CpiContext::new_with_signer(
            self.system_program.to_account_info(),
            system_program::Transfer {
                from: self.vault.to_account_info(),
                to: self.signer.to_account_info(),
            },
            signer_seeds,
        );

        let sol_amount =
            amount.checked_mul(anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL).unwrap();
        system_program::transfer(cpi_context, sol_amount)?;

        // 3. Burn receipt tokens from the user's associated token account
        let burn_ctx = CpiContext::new(
            self.token_program.to_account_info(),
            Burn {
                mint: self.mint_account.to_account_info(),
                from: self.associated_token_account.to_account_info(),
                authority: self.signer.to_account_info(),
            },
        );

        let decimals = self.mint_account.decimals as u32;
        let token_amount = amount.checked_mul(10u64.pow(decimals)).unwrap();
        token::burn(burn_ctx, token_amount)?;

        // 4. Update staked amount in PDA
        self.stake_account.staked_amount = self
            .stake_account
            .staked_amount
            .checked_sub(amount)
            .ok_or(StakeError::Overflow)?;

        // 5. Update global pool totals
        require!(self.pool_state.total_staked >= amount, StakeError::Overflow);
        self.pool_state.total_staked = self
            .pool_state
            .total_staked
            .checked_sub(amount)
            .ok_or(StakeError::Overflow)?;

        Ok(())
    }
}