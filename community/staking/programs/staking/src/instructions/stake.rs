use anchor_lang::{prelude::*, solana_program::native_token::LAMPORTS_PER_SOL, system_program};
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{mint_to, Mint, MintTo, Token, TokenAccount},
};

use crate::{error::StakeError, update_point, PoolState, StakeAccount};

#[derive(Accounts)]
pub struct Stake<'info> {
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
    
    /// CHECK: This PDA has the authority to mint the receipt tokens
    #[account(
        seeds = [b"mint_authority"],
        bump
    )]
    pub mint_authority: UncheckedAccount<'info>,
    
    pub system_program: Program<'info, System>,
}

impl<'info> Stake<'info> {
    pub fn stake(&mut self, amount: u64, mint_auth_bump: u8) -> Result<()> {
        require!(amount > 0, StakeError::InvalidAmount);
        // Accrue any points earned before changing the staked amount, and reset the clock
        let clock = Clock::get()?;
        update_point(&mut self.stake_account, clock.unix_timestamp)?;
        let cpi_program = self.system_program.to_account_info();
        let cpi_accounts = system_program::Transfer {
            from: self.signer.to_account_info(),
            to: self.vault.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        let sol_amount = amount.checked_mul(LAMPORTS_PER_SOL).ok_or(StakeError::Overflow)?;
        system_program::transfer(cpi_ctx, sol_amount)?;
        let authority_seeds = &[
            b"mint_authority".as_ref(),
            &[mint_auth_bump],
        ];
        let signer_seeds = &[&authority_seeds[..]];

        let mint_cpi_program = self.token_program.to_account_info();
        let mint_cpi_accounts = MintTo {
            mint: self.mint_account.to_account_info(),
            to: self.associated_token_account.to_account_info(),
            authority: self.mint_authority.to_account_info(),
        };
        let mint_cpi_ctx = CpiContext::new_with_signer(
            mint_cpi_program, 
            mint_cpi_accounts, 
            signer_seeds
        );

        let decimals = self.mint_account.decimals as u32;
        let token_amount = amount.checked_mul(10u64.pow(decimals)).ok_or(StakeError::Overflow)?;
        mint_to(mint_cpi_ctx, token_amount)?;
        self.stake_account.staked_amount = self.stake_account.staked_amount.checked_add(amount).ok_or(StakeError::Overflow)?;
        self.pool_state.total_staked = self
            .pool_state
            .total_staked
            .checked_add(amount)
            .ok_or(StakeError::Overflow)?;

        Ok(())
    }
}