use hello_world::{Counter, COUNTER_SEED, ID, INCREMENT_DISCRIMINATOR, INITIALIZE_DISCRIMINATOR};
use litesvm::LiteSVM;
use pinocchio::Address;
use solana_instruction::{AccountMeta, Instruction};
use solana_keypair::Keypair;
use solana_signer::Signer;
use solana_transaction::Transaction;

const SYSTEM_PROGRAM_ID: Address = Address::new_from_array([0; 32]);

// Loads the program built by `cargo build-sbf` into a fresh in-process validator.
fn setup() -> (LiteSVM, Keypair) {
    let mut svm = LiteSVM::new();
    svm.add_program_from_file(
        ID,
        concat!(
            env!("CARGO_MANIFEST_DIR"),
            "/../../target/deploy/hello_world.so"
        ),
    )
    .expect("run `cargo build-sbf` before `cargo test`");
    let wallet = Keypair::new();
    svm.airdrop(&wallet.pubkey(), 1_000_000_000).unwrap();
    (svm, wallet)
}

fn counter_address(authority: &Address) -> Address {
    Address::find_program_address(&[COUNTER_SEED, authority.as_ref()], &ID).0
}

fn initialize(wallet: &Keypair) -> Instruction {
    Instruction::new_with_bytes(
        ID,
        &[INITIALIZE_DISCRIMINATOR],
        vec![
            AccountMeta::new(wallet.pubkey(), true),
            AccountMeta::new(counter_address(&wallet.pubkey()), false),
            AccountMeta::new_readonly(SYSTEM_PROGRAM_ID, false),
        ],
    )
}

fn increment(counter: Address, authority: &Keypair) -> Instruction {
    Instruction::new_with_bytes(
        ID,
        &[INCREMENT_DISCRIMINATOR],
        vec![
            AccountMeta::new(counter, false),
            AccountMeta::new_readonly(authority.pubkey(), true),
        ],
    )
}

fn send(svm: &mut LiteSVM, instruction: Instruction, signer: &Keypair) -> bool {
    let tx = Transaction::new_signed_with_payer(
        &[instruction],
        Some(&signer.pubkey()),
        &[signer],
        svm.latest_blockhash(),
    );
    let ok = svm.send_transaction(tx).is_ok();
    // A new blockhash lets the same instruction be sent again without a duplicate-signature error.
    svm.expire_blockhash();
    ok
}

fn count(svm: &LiteSVM, authority: &Address) -> u64 {
    let account = svm.get_account(&counter_address(authority)).unwrap();
    Counter::load(&account.data).unwrap().count
}

#[test]
fn initializes_and_increments() {
    let (mut svm, wallet) = setup();

    assert!(send(&mut svm, initialize(&wallet), &wallet));
    assert_eq!(count(&svm, &wallet.pubkey()), 0);

    let counter = counter_address(&wallet.pubkey());
    assert!(send(&mut svm, increment(counter, &wallet), &wallet));
    assert!(send(&mut svm, increment(counter, &wallet), &wallet));
    assert_eq!(count(&svm, &wallet.pubkey()), 2);
}

#[test]
fn rejects_a_second_initialize() {
    let (mut svm, wallet) = setup();

    assert!(send(&mut svm, initialize(&wallet), &wallet));
    assert!(!send(&mut svm, initialize(&wallet), &wallet));
}

#[test]
fn rejects_increment_from_another_wallet() {
    let (mut svm, wallet) = setup();
    let other = Keypair::new();
    svm.airdrop(&other.pubkey(), 1_000_000_000).unwrap();

    assert!(send(&mut svm, initialize(&wallet), &wallet));
    assert!(!send(
        &mut svm,
        increment(counter_address(&wallet.pubkey()), &other),
        &other
    ));
    assert_eq!(count(&svm, &wallet.pubkey()), 0);
}

#[test]
fn initializes_a_prefunded_counter() {
    let (mut svm, wallet) = setup();
    // Anyone can send lamports to the counter address before it is initialized. This amount is
    // rent exempt for an empty account but not for a counter, so initialize has to top it up.
    svm.airdrop(&counter_address(&wallet.pubkey()), 1_000_000)
        .unwrap();

    assert!(send(&mut svm, initialize(&wallet), &wallet));
    assert_eq!(count(&svm, &wallet.pubkey()), 0);
    assert!(!send(&mut svm, initialize(&wallet), &wallet));
}
