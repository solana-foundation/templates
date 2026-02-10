#[cfg(test)]
mod tests {
    use crate::ID as PROGRAM_ID;
    use litesvm::LiteSVM;
    use solana_sdk::{
        instruction::{AccountMeta, Instruction},
        pubkey::Pubkey,
        signature::Keypair,
        signer::Signer,
        transaction::Transaction,
    };

    const LAMPORTS_PER_SOL: u64 = 1_000_000_000;

    fn setup() -> LiteSVM {
        let mut svm = LiteSVM::new();
        let program_bytes = include_bytes!("../../../target/deploy/basic.so");
        svm.add_program(PROGRAM_ID, program_bytes);
        svm
    }

    fn create_greet_ix() -> Instruction {
        // Anchor discriminator for "greet" = hash("global:greet")[0..8]
        let discriminator: [u8; 8] = [203, 194, 3, 150, 228, 58, 181, 62];

        Instruction {
            program_id: PROGRAM_ID,
            accounts: vec![],
            data: discriminator.to_vec(),
        }
    }

    #[test]
    fn test_hello_world() {
        // Simple hello world test to verify program loads correctly
        let mut svm = setup();

        // Create a user with some SOL
        let user = Keypair::new();
        svm.airdrop(&user.pubkey(), 10 * LAMPORTS_PER_SOL).unwrap();

        // Verify user has expected balance
        let user_balance = svm.get_account(&user.pubkey()).unwrap().lamports;
        assert_eq!(user_balance, 10 * LAMPORTS_PER_SOL, "User should have 10 SOL");

        println!("✓ Basic program loaded successfully");
        println!("✓ Test user created with {} SOL", user_balance / LAMPORTS_PER_SOL);
    }

    #[test]
    fn test_greet() {
        let mut svm = setup();

        // Create a user with some SOL
        let user = Keypair::new();
        svm.airdrop(&user.pubkey(), 10 * LAMPORTS_PER_SOL).unwrap();

        // Create and send greet instruction
        let greet_ix = create_greet_ix();

        let blockhash = svm.latest_blockhash();
        let tx = Transaction::new_signed_with_payer(
            &[greet_ix],
            Some(&user.pubkey()),
            &[&user],
            blockhash,
        );

        let result = svm.send_transaction(tx);
        assert!(result.is_ok(), "Greet instruction should succeed");

        // Check that the "GM!" message was logged
        let tx_result = result.unwrap();
        let logs = &tx_result.logs;
        assert!(
            logs.iter().any(|log| log.contains("GM!")),
            "Expected 'GM!' message in logs"
        );

        println!("✓ Greet instruction executed successfully");
        println!("✓ Program logged: GM!");
    }
}
