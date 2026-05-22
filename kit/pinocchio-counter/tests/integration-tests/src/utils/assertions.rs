use crate::utils::{Address, TestContext};
use pinocchio_counter_client::{accounts::Counter, PINOCCHIO_COUNTER_ID};
use solana_sdk::{instruction::InstructionError, transaction::TransactionError};

pub use pinocchio_counter_client::errors::PinocchioCounterError as ProgramError;

pub fn assert_program_error(tx_error: TransactionError, expected: ProgramError) {
    assert_instruction_error(tx_error, InstructionError::Custom(expected as u32));
}

pub fn assert_account_exists(context: &TestContext, address: &Address) {
    let account = context
        .get_account(address)
        .unwrap_or_else(|| panic!("Account {address} should exist"));
    assert!(!account.data.is_empty(), "Account data should not be empty");
}

pub fn assert_account_not_exists(context: &TestContext, address: &Address) {
    assert!(
        context.get_account(address).is_none(),
        "Account {address} should not exist"
    );
}

/// Assert that a transaction error contains the expected instruction error
pub fn assert_instruction_error(tx_error: TransactionError, expected: InstructionError) {
    match tx_error {
        TransactionError::InstructionError(_, err) => {
            assert_eq!(err, expected, "Expected {expected:?}, got {err:?}");
        }
        other => panic!("Expected InstructionError, got {other:?}"),
    }
}

/// Assert that a transaction error is a custom program error with the given code
pub fn assert_custom_error(tx_error: TransactionError, expected_code: u32) {
    assert_instruction_error(tx_error, InstructionError::Custom(expected_code));
}

pub fn assert_counter_account(
    context: &TestContext,
    counter_pda: &Address,
    expected_authority: &Address,
    expected_bump: u8,
    expected_count: u8,
) {
    let account = context
        .get_account(counter_pda)
        .expect("Counter account should exist");

    assert_eq!(account.owner, PINOCCHIO_COUNTER_ID);

    let counter = Counter::from_bytes(&account.data).expect("Should deserialize counter account");

    assert_eq!(counter.authority.as_ref(), expected_authority.as_ref());
    assert_eq!(counter.bump, expected_bump);
    assert_eq!(counter.count, expected_count);
}
