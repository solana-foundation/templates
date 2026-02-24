use base64::Engine;
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_sdk::instruction::{AccountMeta, Instruction};
use solana_sdk::message::Message;
use solana_sdk::native_token::LAMPORTS_PER_SOL;
use solana_sdk::pubkey::Pubkey;
use solana_sdk::transaction::Transaction;
use std::collections::HashMap;
use std::str::FromStr;

use crate::consts::MEMO_PROGRAM_ID;
use crate::error::AppError;

pub fn get_param<T: FromStr>(params: &HashMap<String, String>, key: &str) -> Result<T, AppError> {
    params
        .get(key)
        .ok_or_else(|| AppError::BadRequest(format!("Missing '{key}' parameter")))?
        .parse()
        .map_err(|_| AppError::BadRequest(format!("Invalid '{key}' parameter")))
}

pub fn sol_to_lamports(sol: f64) -> u64 {
    (sol * LAMPORTS_PER_SOL as f64).round() as u64
}

pub fn lamports_to_sol(lamports: u64) -> f64 {
    lamports as f64 / LAMPORTS_PER_SOL as f64
}

pub fn serialize_tx(tx: &Transaction) -> Result<String, AppError> {
    let bytes = bincode::serialize(tx)?;
    Ok(base64::engine::general_purpose::STANDARD.encode(bytes))
}

pub async fn build_memo_tx(
    rpc: &RpcClient,
    payer: &Pubkey,
    memo: &str,
) -> Result<String, AppError> {
    let ix = Instruction {
        program_id: *MEMO_PROGRAM_ID,
        accounts: vec![AccountMeta::new_readonly(*payer, true)],
        data: memo.as_bytes().to_vec(),
    };
    let blockhash = rpc.get_latest_blockhash().await?;
    let msg = Message::new_with_blockhash(&[ix], Some(payer), &blockhash);
    serialize_tx(&Transaction::new_unsigned(msg))
}
