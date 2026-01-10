use base64::{Engine as _, engine::general_purpose};
use solana_client::{
    rpc_client::RpcClient,
    rpc_config::{ RpcSendTransactionConfig, CommitmentLevel }
};
use solana_sdk::{
    pubkey::Pubkey,
    signature::Signature,
    transaction::VersionedTransaction,
};
use std::str::FromStr;
use crate::shared::{
    error::X402Error,
    types::PaymentRequirements,
};
use spl_token::solana_program::pubkey::Pubkey as SplPubkey;

/// Decode base64 transaction and deserialize from bincode
pub fn decode_transaction(encoded: &str) -> Result<VersionedTransaction, X402Error> {
    let tx_bytes = general_purpose::STANDARD
        .decode(encoded)
        .map_err(|_| X402Error::InvalidPayment("Invalid base64 encoding".to_string()))?;

    bincode::serde::decode_from_slice(&tx_bytes, bincode::config::standard())
        .map(|(tx, _)| tx)
        .map_err(|_| X402Error::InvalidPayment("Invalid transaction format".to_string()))
}

/// Validate that the transaction meets payment criteria
pub fn validate_payment_transaction(
    transaction: &VersionedTransaction,
    requirements: &PaymentRequirements,
) -> Result<(), String> {
    // Check for signature presence
    if transaction.signatures.is_empty() {
        return Err("Missing transaction signatures".to_string());
    }

    // Ensure signatures are non-zero (actually signed)
    let has_real_signature = transaction.signatures.iter()
        .any(|sig| sig.as_ref().iter().any(|&byte| byte != 0));

    if !has_real_signature {
        return Err("Transaction signatures are empty".to_string());
    }

    // Locate SPL Token Program instruction
    let spl_token_program = Pubkey::new_from_array(spl_token::id().to_bytes());

    let token_ix = transaction.message.instructions()
        .iter()
        .find(|instruction| {
            transaction.message.static_account_keys()
                .get(instruction.program_id_index as usize)
                .map(|pid| *pid == spl_token_program)
                .unwrap_or(false)
        })
        .ok_or("Missing SPL token transfer instruction".to_string())?;

    // Parse instruction bytes
    let ix_data = &token_ix.data;

    if ix_data.len() < 9 {
        return Err("Malformed token instruction data".to_string());
    }

    // SPL Token instruction discriminator (3 = Transfer, 12 = TransferChecked)
    let discriminator = ix_data[0];
    if discriminator != 3 && discriminator != 12 {
        return Err(format!("Unexpected instruction type: {}", discriminator));
    }

    // Extract transfer amount (u64 little-endian at offset 1)
    let transfer_amount = u64::from_le_bytes(
        ix_data[1..9].try_into()
            .map_err(|_| "Failed to parse amount bytes".to_string())?
    );

    // Compare with required payment
    let min_payment: u64 = requirements.max_amount_required.parse()
        .map_err(|_| "Invalid payment requirement format".to_string())?;

    if transfer_amount < min_payment {
        return Err(format!(
            "Payment amount too low: got {}, need at least {}",
            transfer_amount, min_payment
        ));
    }

    // Validate recipient address
    // Parse required receiver wallet and mint addresses
    let receiver_wallet = Pubkey::from_str(&requirements.pay_to)
        .map_err(|_| "Invalid receiver address in requirements".to_string())?;

    let usdc_mint = Pubkey::from_str(&requirements.asset)
        .map_err(|_| "Invalid USDC mint address in requirements".to_string())?;

    // Convert to spl_token Pubkey type
    let receiver_wallet_spl = SplPubkey::new_from_array(receiver_wallet.to_bytes());
    let usdc_mint_spl = SplPubkey::new_from_array(usdc_mint.to_bytes());
    
    // Derive the expected Associated Token Account (ATA) for the receiver
    let expected_ata_spl = spl_associated_token_account::get_associated_token_address(
        &receiver_wallet_spl,
        &usdc_mint_spl,
    );

    // Convert back to solana_sdk Pubkey for comparison
    let expected_ata = Pubkey::new_from_array(expected_ata_spl.to_bytes());

    // Extract destination account from instruction
    // For Transfer (discriminator 3): destination is at account index 1
    // For TransferChecked (discriminator 12): destination is at account index 2
    let destination_account_index = if discriminator == 3 { 1 } else { 2 };

    let destination_pubkey = token_ix.accounts.get(destination_account_index)
        .and_then(|idx| transaction.message.static_account_keys().get(*idx as usize))
        .ok_or("Missing destination account in transfer instruction".to_string())?;

    // Verify payment is going to the correct recipient
    if *destination_pubkey != expected_ata {
        return Err(format!(
            "Payment recipient mismatch: expected {}, got {}",
            expected_ata, destination_pubkey
        ));
    }

    Ok(())
}

/// Broadcast transaction to Solana network
pub async fn broadcast_to_chain(
    rpc_url: &str,
    transaction: VersionedTransaction,
) -> Result<Signature, X402Error> {
    let rpc_url = rpc_url.to_string();
    tokio::task::spawn_blocking(move || {
        let rpc_client = RpcClient::new(rpc_url);

        let send_config = RpcSendTransactionConfig {
            skip_preflight: false,
            preflight_commitment: Some(CommitmentLevel::Confirmed),
            encoding: None,
            max_retries: None,
            min_context_slot: None,
        };

        rpc_client
            .send_transaction_with_config(&transaction, send_config)
            .map_err(|err| {
                if err.to_string().contains("Blockhash not found") {
                    X402Error::VerificationFailed("Transaction blockhash expired, please retry".to_string())
                } else {
                    X402Error::FacilitatorError(format!("RPC submission failed: {}", err))
                }
            })
    })
    .await
    .map_err(|_| X402Error::InternalError("Blockchain broadcast task failed".to_string()))?
}