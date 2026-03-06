use anchor_lang::prelude::*;

use crate::StakeAccount;

#[derive(Accounts)]
#[instruction(seed: u64)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    
    #[account(
        init,
        payer = signer,
        space = 8 + StakeAccount::INIT_SPACE,
        seeds = [b"client1", signer.key().as_ref()],
        bump
    )]
    pub stake_account: Account<'info, StakeAccount>,
    
    /// CHECK: This is a PDA that holds the SOL
    #[account(
        mut,
        seeds = [b"vault", signer.key().as_ref()],
        bump
    )]
    pub vault: SystemAccount<'info>,
    
    pub system_program: Program<'info, System>,
}

impl<'info> Initialize<'info> {
    pub fn initialize(&mut self, _seed: u64, bumps: &InitializeBumps) -> Result<()> {
        let clock = Clock::get()?;
        self.stake_account.set_inner(StakeAccount {
            point: 0,
            bump: bumps.stake_account,
            last_update_amount: clock.unix_timestamp,
            signer: self.signer.key(), 
            staked_amount: 0,
            seed: _seed       
        });
        
        Ok(()) 
    }
}