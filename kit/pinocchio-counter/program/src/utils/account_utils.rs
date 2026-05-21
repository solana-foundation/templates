//! Account validation utilities.

use crate::ID as PINOCCHIO_COUNTER_PROGRAM_ID;
use pinocchio::{account::AccountView, address::Address, error::ProgramError};

/// Verify account is writable, returning an error if it is not.
///
/// # Arguments
/// * `account` - The account to verify.
///
/// # Returns
/// * `Result<(), ProgramError>` - The result of the operation
#[inline(always)]
pub fn verify_writable(account: &AccountView) -> Result<(), ProgramError> {
    if !account.is_writable() {
        return Err(ProgramError::Immutable);
    }
    Ok(())
}

/// Verify account is read-only, returning an error if it is writable.
///
/// # Arguments
/// * `account` - The account to verify.
///
/// # Returns
/// * `Result<(), ProgramError>` - The result of the operation
#[inline(always)]
pub fn verify_readonly(account: &AccountView) -> Result<(), ProgramError> {
    if account.is_writable() {
        return Err(ProgramError::AccountBorrowFailed);
    }
    Ok(())
}

/// Verify account is a signer, returning an error if it is not.
///
/// # Arguments
/// * `account` - The account to verify.
///
/// # Returns
/// * `Result<(), ProgramError>` - The result of the operation
#[inline(always)]
pub fn verify_signer(account: &AccountView) -> Result<(), ProgramError> {
    if !account.is_signer() {
        return Err(ProgramError::MissingRequiredSignature);
    }
    Ok(())
}

/// Verify account's owner, returning an error if it is not the expected owner.
///
/// # Arguments
/// * `account` - The account to verify.
/// * `owner` - The expected owner.
///
/// # Returns
/// * `Result<(), ProgramError>` - The result of the operation
#[inline(always)]
pub fn verify_owned_by(account: &AccountView, owner: &Address) -> Result<(), ProgramError> {
    if !account.owned_by(owner) {
        return Err(ProgramError::InvalidAccountOwner);
    }

    Ok(())
}

/// Verify account is a system account, returning an error if it is not.
///
/// # Arguments
/// * `account` - The account to verify.
///
/// # Returns
/// * `Result<(), ProgramError>` - The result of the operation
#[inline(always)]
pub fn verify_system_account(account: &AccountView) -> Result<(), ProgramError> {
    verify_owned_by(account, &pinocchio_system::ID)
}

/// Verify account is the current program, returning an error if it is not.
///
/// # Arguments
/// * `account` - The account to verify.
///
/// # Returns
/// * `Result<(), ProgramError>` - The result of the operation
#[inline(always)]
pub fn verify_current_program_account(account: &AccountView) -> Result<(), ProgramError> {
    verify_owned_by(account, &PINOCCHIO_COUNTER_PROGRAM_ID)
}

/// Verify account data is empty, returning an error if it is not.
///
/// # Arguments
/// * `account` - The account to verify.
///
/// # Returns
/// * `Result<(), ProgramError>` - The result of the operation
#[inline(always)]
pub fn verify_empty(account: &AccountView) -> Result<(), ProgramError> {
    if account.data_len() != 0 {
        return Err(ProgramError::AccountAlreadyInitialized);
    }
    Ok(())
}
