#[cfg(test)]
mod tests {
    use crate::{AirdropState, ID as PROGRAM_ID};
    use anchor_litesvm::{build_anchor_instruction, AccountMeta, AnchorLiteSVM, AnchorSerialize};
    use litesvm_utils::{AssertionHelpers, TestHelpers};
    use solana_sdk::{signer::Signer, system_program};

    const LAMPORTS_PER_SOL: u64 = 1_000_000_000;

    #[derive(AnchorSerialize)]
    struct InitializeAirdropArgs {
        merkle_root: [u8; 32],
        amount: u64,
    }

    #[test]
    fn test_hello_world() {
        let mut ctx = AnchorLiteSVM::build_with_program(
            PROGRAM_ID,
            include_bytes!("../../../target/deploy/solana_distributor.so"),
        );

        let authority = ctx.svm.create_funded_account(10 * LAMPORTS_PER_SOL).unwrap();
        ctx.svm.assert_sol_balance(&authority.pubkey(), 10 * LAMPORTS_PER_SOL);

        println!("✓ Solana Distributor program loaded successfully");
        println!("✓ Test authority created with 10 SOL");
    }

    #[test]
    fn test_initialize_airdrop() {
        let mut ctx = AnchorLiteSVM::build_with_program(
            PROGRAM_ID,
            include_bytes!("../../../target/deploy/solana_distributor.so"),
        );

        let authority = ctx.svm.create_funded_account(10 * LAMPORTS_PER_SOL).unwrap();
        let airdrop_state_pda = ctx.svm.get_pda(&[b"merkle_tree"], &PROGRAM_ID);

        let merkle_root = [0u8; 32];
        let airdrop_amount = 5 * LAMPORTS_PER_SOL;

        let init_ix = build_anchor_instruction(
            &PROGRAM_ID,
            "initialize_airdrop",
            vec![
                AccountMeta::new(airdrop_state_pda, false),
                AccountMeta::new(authority.pubkey(), true),
                AccountMeta::new_readonly(system_program::id(), false),
            ],
            InitializeAirdropArgs { merkle_root, amount: airdrop_amount },
        )
        .unwrap();

        ctx.execute_instruction(init_ix, &[&authority])
            .unwrap()
            .assert_success();

        ctx.svm.assert_account_exists(&airdrop_state_pda);
        ctx.svm.assert_account_owner(&airdrop_state_pda, &PROGRAM_ID);

        let state = ctx.get_account::<AirdropState>(&airdrop_state_pda).unwrap();
        assert_eq!(state.merkle_root, merkle_root, "Merkle root should match");
        assert_eq!(state.airdrop_amount, airdrop_amount, "Airdrop amount should match");
        assert_eq!(state.authority, authority.pubkey(), "Authority should match");
        assert_eq!(state.amount_claimed, 0, "No tokens should be claimed yet");

        println!("✓ Airdrop initialized successfully");
        println!("  - Merkle root: {:02x?}", &merkle_root[..8]);
        println!("  - Airdrop amount: {} SOL", airdrop_amount / LAMPORTS_PER_SOL);
    }

    #[test]
    fn test_initialize_with_custom_merkle_root() {
        let mut ctx = AnchorLiteSVM::build_with_program(
            PROGRAM_ID,
            include_bytes!("../../../target/deploy/solana_distributor.so"),
        );

        let authority = ctx.svm.create_funded_account(10 * LAMPORTS_PER_SOL).unwrap();
        let airdrop_state_pda = ctx.svm.get_pda(&[b"merkle_tree"], &PROGRAM_ID);

        let merkle_root = [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
            24, 25, 26, 27, 28, 29, 30, 31, 32,
        ];
        let airdrop_amount = 2 * LAMPORTS_PER_SOL;

        let init_ix = build_anchor_instruction(
            &PROGRAM_ID,
            "initialize_airdrop",
            vec![
                AccountMeta::new(airdrop_state_pda, false),
                AccountMeta::new(authority.pubkey(), true),
                AccountMeta::new_readonly(system_program::id(), false),
            ],
            InitializeAirdropArgs { merkle_root, amount: airdrop_amount },
        )
        .unwrap();

        ctx.execute_instruction(init_ix, &[&authority])
            .unwrap()
            .assert_success();

        ctx.svm.assert_account_exists(&airdrop_state_pda);
        ctx.svm.assert_account_owner(&airdrop_state_pda, &PROGRAM_ID);

        let state = ctx.get_account::<AirdropState>(&airdrop_state_pda).unwrap();
        assert_eq!(state.merkle_root, merkle_root, "Custom merkle root should be stored correctly");
        assert_eq!(state.airdrop_amount, airdrop_amount, "Airdrop amount should match");
        assert_eq!(state.authority, authority.pubkey(), "Authority should match");
        assert_eq!(state.amount_claimed, 0, "No tokens should be claimed yet");

        println!("✓ Airdrop initialized with custom merkle root");
        println!("  - Custom root verified successfully");
    }
}
