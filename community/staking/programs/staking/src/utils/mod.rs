use anchor_lang::prelude::*;

use crate::error::StakeError;
use crate::state::StakeAccount;

pub const POINTS: u64 = 1_000_000;
pub const SECONDS: u64 = 3_600;

/// Updates the user's point balance based on the time elapsed since their last interaction.
pub fn update_point(pda_account: &mut StakeAccount, current_time: i64) -> Result<()> {
    let time = current_time
        .checked_sub(pda_account.last_update_amount)
        .ok_or(StakeError::InvalidTimestamp)?;
        
    // Only calculate and add points if time has passed and they actually have assets staked
    if time > 0 && pda_account.staked_amount > 0 {
        let new_points = calculate_point_earned(pda_account.staked_amount, time)?;
        pda_account.point = pda_account.point
            .checked_add(new_points)
            .ok_or(StakeError::Overflow)?;
    }
    
    // Update the timestamp so they don't get double-paid for this time period
    pda_account.last_update_amount = current_time; 
    
    Ok(())
}

/// Core math engine: Calculates points based on staked amount and time locked.
/// Casts to u128 to prevent overflow during intermediate multiplication steps.
pub fn calculate_point_earned(staked: u64, time: i64) -> Result<u64> {
    let points = (staked as u128)
        .checked_mul(time as u128)
        .ok_or(StakeError::Overflow)?
        .checked_mul(POINTS as u128)
        .ok_or(StakeError::Overflow)?
        .checked_div(SECONDS as u128)
        .ok_or(StakeError::Overflow)?;
        
    Ok(points as u64)
}