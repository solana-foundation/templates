#[cfg(test)]
mod tests {
    use crate::{Counter, ID as PROGRAM_ID};
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

    const LAMPORTS_PER_SOL: u64 = 1_000_000_000;

    fn setup() -> LiteSVM {
        let mut svm = LiteSVM::new();
        let program_bytes = include_bytes!("../../../target/deploy/counter.so");
        svm.add_program(PROGRAM_ID, program_bytes);
        svm
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

    fn create_initialize_ix(payer: &Pubkey, counter: &Pubkey) -> Instruction {
        let discriminator = get_discriminator("global", "initialize");

        Instruction {
            program_id: PROGRAM_ID,
            accounts: vec![
                AccountMeta::new(*payer, true),
                AccountMeta::new(*counter, true),
                AccountMeta::new_readonly(system_program::id(), false),
            ],
            data: discriminator.to_vec(),
        }
    }

    fn create_increment_ix(counter: &Pubkey) -> Instruction {
        let discriminator = get_discriminator("global", "increment");

        Instruction {
            program_id: PROGRAM_ID,
            accounts: vec![AccountMeta::new(*counter, false)],
            data: discriminator.to_vec(),
        }
    }

    fn create_decrement_ix(counter: &Pubkey) -> Instruction {
        let discriminator = get_discriminator("global", "decrement");

        Instruction {
            program_id: PROGRAM_ID,
            accounts: vec![AccountMeta::new(*counter, false)],
            data: discriminator.to_vec(),
        }
    }

    fn create_set_ix(counter: &Pubkey, value: u8) -> Instruction {
        let discriminator = get_discriminator("global", "set");
        let mut data = discriminator.to_vec();
        data.push(value);

        Instruction {
            program_id: PROGRAM_ID,
            accounts: vec![AccountMeta::new(*counter, false)],
            data,
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

        println!("✓ Counter program loaded successfully");
        println!("✓ Test user created with {} SOL", user_balance / LAMPORTS_PER_SOL);
    }

    #[test]
    fn test_initialize_counter() {
        let mut svm = setup();

        let payer = Keypair::new();
        svm.airdrop(&payer.pubkey(), 10 * LAMPORTS_PER_SOL).unwrap();

        let counter = Keypair::new();

        let init_ix = create_initialize_ix(&payer.pubkey(), &counter.pubkey());

        let blockhash = svm.latest_blockhash();
        let tx = Transaction::new_signed_with_payer(
            &[init_ix],
            Some(&payer.pubkey()),
            &[&payer, &counter],
            blockhash,
        );

        let result = svm.send_transaction(tx);
        assert!(result.is_ok(), "Initialize should succeed");

        // Verify counter account was created
        let counter_account = svm.get_account(&counter.pubkey());
        assert!(counter_account.is_some(), "Counter account should exist");

        println!("✓ Counter initialized successfully");
    }

    #[test]
    fn test_increment() {
        let mut svm = setup();

        let payer = Keypair::new();
        svm.airdrop(&payer.pubkey(), 10 * LAMPORTS_PER_SOL).unwrap();

        let counter = Keypair::new();

        // Initialize
        let init_ix = create_initialize_ix(&payer.pubkey(), &counter.pubkey());
        let blockhash = svm.latest_blockhash();
        let tx = Transaction::new_signed_with_payer(
            &[init_ix],
            Some(&payer.pubkey()),
            &[&payer, &counter],
            blockhash,
        );
        svm.send_transaction(tx).unwrap();

        // Increment
        let inc_ix = create_increment_ix(&counter.pubkey());
        let blockhash = svm.latest_blockhash();
        let tx = Transaction::new_signed_with_payer(
            &[inc_ix],
            Some(&payer.pubkey()),
            &[&payer],
            blockhash,
        );

        let result = svm.send_transaction(tx);
        assert!(result.is_ok(), "Increment should succeed");

        println!("✓ Counter incremented successfully");
    }

    #[test]
    fn test_set_and_decrement() {
        let mut svm = setup();

        let payer = Keypair::new();
        svm.airdrop(&payer.pubkey(), 10 * LAMPORTS_PER_SOL).unwrap();

        let counter = Keypair::new();

        // Initialize
        let init_ix = create_initialize_ix(&payer.pubkey(), &counter.pubkey());
        let blockhash = svm.latest_blockhash();
        let tx = Transaction::new_signed_with_payer(
            &[init_ix],
            Some(&payer.pubkey()),
            &[&payer, &counter],
            blockhash,
        );
        svm.send_transaction(tx).unwrap();

        // Set to 5
        let set_ix = create_set_ix(&counter.pubkey(), 5);
        let blockhash = svm.latest_blockhash();
        let tx = Transaction::new_signed_with_payer(
            &[set_ix],
            Some(&payer.pubkey()),
            &[&payer],
            blockhash,
        );
        svm.send_transaction(tx).unwrap();

        // Decrement
        let dec_ix = create_decrement_ix(&counter.pubkey());
        let blockhash = svm.latest_blockhash();
        let tx = Transaction::new_signed_with_payer(
            &[dec_ix],
            Some(&payer.pubkey()),
            &[&payer],
            blockhash,
        );

        let result = svm.send_transaction(tx);
        assert!(result.is_ok(), "Decrement should succeed");

        println!("✓ Counter set and decremented successfully");
    }
}
