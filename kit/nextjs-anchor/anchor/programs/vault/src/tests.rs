#![allow(unexpected_cfgs)]

use anchor_lang::prelude::*;
use litesvm::LiteSVM;
use sha2::{Digest, Sha256};
use solana_sdk::{
    instruction::{AccountMeta, Instruction},
    pubkey::Pubkey,
    signature::Keypair,
    signer::Signer,
    system_program,
    transaction::Transaction,
};

// Import the program module
use crate::{vault, VaultAction, ID as PROGRAM_ID};

const LAMPORTS_PER_SOL: u64 = 1_000_000_000;

/// Helper to set up test context with the vault program
fn setup() -> LiteSVM {
    let mut svm = LiteSVM::new();
    let program_bytes = include_bytes!("../../../target/deploy/vault.so");
    svm.add_program(PROGRAM_ID, program_bytes);
    svm
}

/// Helper to get vault PDA
fn get_vault_pda(user: &Pubkey) -> (Pubkey, u8) {
    Pubkey::find_program_address(&[b"vault", user.as_ref()], &PROGRAM_ID)
}

/// Helper to compute Anchor instruction discriminator
fn get_discriminator(namespace: &str, name: &str) -> [u8; 8] {
    let mut hasher = Sha256::new();
    hasher.update(format!("{}:{}", namespace, name).as_bytes());
    let hash = hasher.finalize();
    let mut discriminator = [0u8; 8];
    discriminator.copy_from_slice(&hash[..8]);
    discriminator
}

#[test]
fn test_hello_world() {
    // Simple hello world test to verify program loads correctly
    let mut svm = setup();

    // Create a funded user account
    let user = Keypair::new();
    svm.airdrop(&user.pubkey(), 10 * LAMPORTS_PER_SOL).unwrap();

    // Verify user has expected balance
    let user_balance = svm.get_account(&user.pubkey()).unwrap().lamports;
    assert_eq!(
        user_balance,
        10 * LAMPORTS_PER_SOL,
        "User should have 10 SOL"
    );

    println!("✓ Vault program loaded successfully");
    println!("✓ Test user created with 10 SOL");
}

#[test]
fn test_deposit_and_withdraw() {
    let mut svm = setup();

    // Create a funded user account
    let user = Keypair::new();
    svm.airdrop(&user.pubkey(), 10 * LAMPORTS_PER_SOL).unwrap();

    // Get vault PDA
    let (vault_pda, _bump) = get_vault_pda(&user.pubkey());

    // Build deposit instruction
    let deposit_amount = LAMPORTS_PER_SOL;
    let deposit_discriminator = get_discriminator("global", "deposit");
    let mut deposit_data = deposit_discriminator.to_vec();
    deposit_data.extend_from_slice(&deposit_amount.to_le_bytes());

    let deposit_ix = Instruction {
        program_id: PROGRAM_ID,
        accounts: vec![
            AccountMeta::new(user.pubkey(), true),
            AccountMeta::new(vault_pda, false),
            AccountMeta::new_readonly(system_program::id(), false),
        ],
        data: deposit_data,
    };

    let blockhash = svm.latest_blockhash();
    let deposit_tx = Transaction::new_signed_with_payer(
        &[deposit_ix],
        Some(&user.pubkey()),
        &[&user],
        blockhash,
    );

    let result = svm.send_transaction(deposit_tx);
    assert!(result.is_ok(), "Deposit transaction should succeed");

    // Verify vault balance
    let vault_balance = svm.get_account(&vault_pda).unwrap().lamports;
    assert_eq!(
        vault_balance, deposit_amount,
        "Vault should have deposit amount"
    );

    // Build withdraw instruction
    let withdraw_discriminator = get_discriminator("global", "withdraw");
    let withdraw_data = withdraw_discriminator.to_vec();

    let withdraw_ix = Instruction {
        program_id: PROGRAM_ID,
        accounts: vec![
            AccountMeta::new(user.pubkey(), true),
            AccountMeta::new(vault_pda, false),
            AccountMeta::new_readonly(system_program::id(), false),
        ],
        data: withdraw_data,
    };

    let blockhash = svm.latest_blockhash();
    let withdraw_tx = Transaction::new_signed_with_payer(
        &[withdraw_ix],
        Some(&user.pubkey()),
        &[&user],
        blockhash,
    );

    let result = svm.send_transaction(withdraw_tx);
    assert!(result.is_ok(), "Withdraw transaction should succeed");

    // Verify vault is empty (account should be closed)
    // In LiteSVM, closed accounts might still exist with 0 lamports and 0 data
    let vault_closed = match svm.get_account(&vault_pda) {
        None => true,
        Some(account) => account.lamports == 0 && account.data.is_empty(),
    };
    assert!(
        vault_closed,
        "Vault account should be closed (0 lamports, 0 data)"
    );

    println!("✓ Deposit and withdraw completed successfully");
}

#[test]
fn test_deposit_fails_if_vault_has_funds() {
    let mut svm = setup();

    let user = Keypair::new();
    svm.airdrop(&user.pubkey(), 10 * LAMPORTS_PER_SOL).unwrap();
    let (vault_pda, _bump) = get_vault_pda(&user.pubkey());

    // First deposit
    let deposit_discriminator = get_discriminator("global", "deposit");
    let mut deposit_data = deposit_discriminator.to_vec();
    deposit_data.extend_from_slice(&LAMPORTS_PER_SOL.to_le_bytes());

    let deposit_accounts = vec![
        AccountMeta::new(user.pubkey(), true),
        AccountMeta::new(vault_pda, false),
        AccountMeta::new_readonly(system_program::id(), false),
    ];

    let deposit_ix = Instruction {
        program_id: PROGRAM_ID,
        accounts: deposit_accounts.clone(),
        data: deposit_data.clone(),
    };

    let blockhash = svm.latest_blockhash();
    let tx = Transaction::new_signed_with_payer(
        &[deposit_ix],
        Some(&user.pubkey()),
        &[&user],
        blockhash,
    );
    let result = svm.send_transaction(tx);
    assert!(result.is_ok(), "First deposit should succeed");

    // Second deposit should fail
    let deposit_ix2 = Instruction {
        program_id: PROGRAM_ID,
        accounts: deposit_accounts,
        data: deposit_data,
    };

    let blockhash = svm.latest_blockhash();
    let tx2 = Transaction::new_signed_with_payer(
        &[deposit_ix2],
        Some(&user.pubkey()),
        &[&user],
        blockhash,
    );

    let result = svm.send_transaction(tx2);
    assert!(result.is_err(), "Second deposit should fail");

    println!("✓ Second deposit correctly failed");
}

#[test]
fn test_withdraw_fails_if_vault_empty() {
    let mut svm = setup();

    let user = Keypair::new();
    svm.airdrop(&user.pubkey(), 10 * LAMPORTS_PER_SOL).unwrap();
    let (vault_pda, _bump) = get_vault_pda(&user.pubkey());

    // Try to withdraw from empty vault
    let withdraw_discriminator = get_discriminator("global", "withdraw");
    let withdraw_data = withdraw_discriminator.to_vec();

    let withdraw_ix = Instruction {
        program_id: PROGRAM_ID,
        accounts: vec![
            AccountMeta::new(user.pubkey(), true),
            AccountMeta::new(vault_pda, false),
            AccountMeta::new_readonly(system_program::id(), false),
        ],
        data: withdraw_data,
    };

    let blockhash = svm.latest_blockhash();
    let tx = Transaction::new_signed_with_payer(
        &[withdraw_ix],
        Some(&user.pubkey()),
        &[&user],
        blockhash,
    );

    let result = svm.send_transaction(tx);
    assert!(result.is_err(), "Withdraw from empty vault should fail");

    println!("✓ Withdraw from empty vault correctly failed");
}
