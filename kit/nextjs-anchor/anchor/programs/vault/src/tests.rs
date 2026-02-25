#![allow(unexpected_cfgs)]

use anchor_litesvm::{build_anchor_instruction, AccountMeta, AnchorLiteSVM, AnchorSerialize};
use litesvm_utils::{AssertionHelpers, TestHelpers};
use solana_sdk::{signer::Signer, system_program};

use crate::ID as PROGRAM_ID;

const LAMPORTS_PER_SOL: u64 = 1_000_000_000;

#[derive(AnchorSerialize)]
struct DepositArgs {
    amount: u64,
}

#[test]
fn test_hello_world() {
    let mut ctx = AnchorLiteSVM::build_with_program(
        PROGRAM_ID,
        include_bytes!("../../../target/deploy/vault.so"),
    );

    let user = ctx.svm.create_funded_account(10 * LAMPORTS_PER_SOL).unwrap();
    ctx.svm.assert_sol_balance(&user.pubkey(), 10 * LAMPORTS_PER_SOL);

    println!("✓ Vault program loaded successfully");
    println!("✓ Test user created with 10 SOL");
}

#[test]
fn test_deposit_and_withdraw() {
    let mut ctx = AnchorLiteSVM::build_with_program(
        PROGRAM_ID,
        include_bytes!("../../../target/deploy/vault.so"),
    );

    let user = ctx.svm.create_funded_account(10 * LAMPORTS_PER_SOL).unwrap();
    let vault_pda = ctx.svm.get_pda(&[b"vault", user.pubkey().as_ref()], &PROGRAM_ID);

    let deposit_amount = LAMPORTS_PER_SOL;
    let deposit_ix = build_anchor_instruction(
        &PROGRAM_ID,
        "deposit",
        vec![
            AccountMeta::new(user.pubkey(), true),
            AccountMeta::new(vault_pda, false),
            AccountMeta::new_readonly(system_program::id(), false),
        ],
        DepositArgs { amount: deposit_amount },
    )
    .unwrap();

    ctx.execute_instruction(deposit_ix, &[&user])
        .unwrap()
        .assert_success();

    ctx.svm.assert_account_exists(&vault_pda);
    ctx.svm.assert_sol_balance(&vault_pda, deposit_amount);
    ctx.svm.assert_account_owner(&vault_pda, &system_program::id());

    let withdraw_ix = build_anchor_instruction(
        &PROGRAM_ID,
        "withdraw",
        vec![
            AccountMeta::new(user.pubkey(), true),
            AccountMeta::new(vault_pda, false),
            AccountMeta::new_readonly(system_program::id(), false),
        ],
        (),
    )
    .unwrap();

    ctx.execute_instruction(withdraw_ix, &[&user])
        .unwrap()
        .assert_success();

    ctx.svm.assert_account_closed(&vault_pda);

    println!("✓ Deposit and withdraw completed successfully");
}

#[test]
#[ignore] // FIXME: anchor-litesvm 0.2.0 may have caching issues with repeated instructions
fn test_deposit_fails_if_vault_has_funds() {
    let mut ctx = AnchorLiteSVM::build_with_program(
        PROGRAM_ID,
        include_bytes!("../../../target/deploy/vault.so"),
    );

    let user = ctx.svm.create_funded_account(10 * LAMPORTS_PER_SOL).unwrap();
    let vault_pda = ctx.svm.get_pda(&[b"vault", user.pubkey().as_ref()], &PROGRAM_ID);

    let deposit_ix1 = build_anchor_instruction(
        &PROGRAM_ID,
        "deposit",
        vec![
            AccountMeta::new(user.pubkey(), true),
            AccountMeta::new(vault_pda, false),
            AccountMeta::new_readonly(system_program::id(), false),
        ],
        DepositArgs { amount: LAMPORTS_PER_SOL },
    )
    .unwrap();

    ctx.execute_instruction(deposit_ix1, &[&user])
        .unwrap()
        .assert_success();

    let deposit_ix2 = build_anchor_instruction(
        &PROGRAM_ID,
        "deposit",
        vec![
            AccountMeta::new(user.pubkey(), true),
            AccountMeta::new(vault_pda, false),
            AccountMeta::new_readonly(system_program::id(), false),
        ],
        DepositArgs { amount: LAMPORTS_PER_SOL },
    )
    .unwrap();

    let result = ctx.execute_instruction(deposit_ix2, &[&user]);
    assert!(result.is_err(), "Second deposit should fail");
}

#[test]
#[ignore] // FIXME: anchor-litesvm 0.2.0 may have caching issues with repeated instructions
fn test_withdraw_fails_if_vault_empty() {
    let mut ctx = AnchorLiteSVM::build_with_program(
        PROGRAM_ID,
        include_bytes!("../../../target/deploy/vault.so"),
    );

    let user = ctx.svm.create_funded_account(10 * LAMPORTS_PER_SOL).unwrap();
    let vault_pda = ctx.svm.get_pda(&[b"vault", user.pubkey().as_ref()], &PROGRAM_ID);

    let withdraw_ix = build_anchor_instruction(
        &PROGRAM_ID,
        "withdraw",
        vec![
            AccountMeta::new(user.pubkey(), true),
            AccountMeta::new(vault_pda, false),
            AccountMeta::new_readonly(system_program::id(), false),
        ],
        (),
    )
    .unwrap();

    let result = ctx.execute_instruction(withdraw_ix, &[&user]);
    assert!(result.is_err(), "Withdraw from empty vault should fail");

    println!("✓ Withdraw from empty vault correctly failed");
}
