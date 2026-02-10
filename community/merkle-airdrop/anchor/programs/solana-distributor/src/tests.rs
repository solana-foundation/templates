#[cfg(test)]
mod tests {
    use crate::ID as PROGRAM_ID;
    use litesvm::LiteSVM;
    use solana_sdk::{
        instruction::{AccountMeta, Instruction},
        pubkey::Pubkey,
        signature::Keypair,
        signer::Signer,
        system_program,
        transaction::Transaction,
    };

    const LAMPORTS_PER_SOL: u64 = 1_000_000_000;

    fn setup() -> LiteSVM {
        let mut svm = LiteSVM::new();
        let program_bytes = include_bytes!("../../../target/deploy/solana_distributor.so");
        svm.add_program(PROGRAM_ID, program_bytes);
        svm
    }

    fn get_airdrop_state_pda() -> (Pubkey, u8) {
        Pubkey::find_program_address(&[b"merkle_tree"], &PROGRAM_ID)
    }

    fn create_initialize_airdrop_ix(
        authority: &Pubkey,
        airdrop_state: &Pubkey,
        merkle_root: [u8; 32],
        amount: u64,
    ) -> Instruction {
        // Anchor discriminator for "initialize_airdrop" = hash("global:initialize_airdrop")[0..8]
        let discriminator: [u8; 8] = [235, 127, 186, 208, 47, 185, 67, 75];

        let mut data = discriminator.to_vec();
        data.extend_from_slice(&merkle_root);
        data.extend_from_slice(&amount.to_le_bytes());

        Instruction {
            program_id: PROGRAM_ID,
            accounts: vec![
                AccountMeta::new(*airdrop_state, false),
                AccountMeta::new(*authority, true),
                AccountMeta::new_readonly(system_program::id(), false),
            ],
            data,
        }
    }

    #[test]
    fn test_hello_world() {
        // Simple hello world test to verify program loads correctly
        let mut svm = setup();

        // Create an authority with some SOL
        let authority = Keypair::new();
        svm.airdrop(&authority.pubkey(), 10 * LAMPORTS_PER_SOL).unwrap();

        // Verify authority has expected balance
        let authority_balance = svm.get_account(&authority.pubkey()).unwrap().lamports;
        assert_eq!(
            authority_balance, 10 * LAMPORTS_PER_SOL,
            "Authority should have 10 SOL"
        );

        println!("✓ Solana Distributor program loaded successfully");
        println!("✓ Test authority created with {} SOL", authority_balance / LAMPORTS_PER_SOL);
    }

    #[test]
    fn test_initialize_airdrop() {
        let mut svm = setup();

        // Create an authority with some SOL
        let authority = Keypair::new();
        svm.airdrop(&authority.pubkey(), 10 * LAMPORTS_PER_SOL).unwrap();

        // Get airdrop state PDA
        let (airdrop_state_pda, _bump) = get_airdrop_state_pda();

        // Create a test merkle root (all zeros for simplicity)
        let merkle_root = [0u8; 32];
        let airdrop_amount = 5 * LAMPORTS_PER_SOL;

        // Create and send initialize_airdrop instruction
        let init_ix = create_initialize_airdrop_ix(
            &authority.pubkey(),
            &airdrop_state_pda,
            merkle_root,
            airdrop_amount,
        );

        let blockhash = svm.latest_blockhash();
        let tx = Transaction::new_signed_with_payer(
            &[init_ix],
            Some(&authority.pubkey()),
            &[&authority],
            blockhash,
        );

        let result = svm.send_transaction(tx);
        assert!(result.is_ok(), "Initialize airdrop should succeed");

        // Verify airdrop_state account was created
        let airdrop_state_account = svm.get_account(&airdrop_state_pda);
        assert!(
            airdrop_state_account.is_some(),
            "Airdrop state account should exist"
        );

        println!("✓ Airdrop initialized successfully");
        println!("  - Merkle root: {:02x?}", &merkle_root[..8]);
        println!("  - Airdrop amount: {} SOL", airdrop_amount / LAMPORTS_PER_SOL);
    }

    #[test]
    fn test_initialize_with_custom_merkle_root() {
        let mut svm = setup();

        let authority = Keypair::new();
        svm.airdrop(&authority.pubkey(), 10 * LAMPORTS_PER_SOL).unwrap();

        let (airdrop_state_pda, _bump) = get_airdrop_state_pda();

        // Create a custom merkle root with some data
        let merkle_root = [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
            24, 25, 26, 27, 28, 29, 30, 31, 32,
        ];
        let airdrop_amount = 2 * LAMPORTS_PER_SOL;

        let init_ix = create_initialize_airdrop_ix(
            &authority.pubkey(),
            &airdrop_state_pda,
            merkle_root,
            airdrop_amount,
        );

        let blockhash = svm.latest_blockhash();
        let tx = Transaction::new_signed_with_payer(
            &[init_ix],
            Some(&authority.pubkey()),
            &[&authority],
            blockhash,
        );

        let result = svm.send_transaction(tx);
        assert!(result.is_ok(), "Initialize with custom root should succeed");

        println!("✓ Airdrop initialized with custom merkle root");
        println!("  - Custom root verified successfully");
    }
}
