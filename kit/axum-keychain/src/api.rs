use std::sync::Arc;

use axum::extract::State;
use axum::http::StatusCode;
use axum::Json;
use base64::engine::general_purpose::STANDARD as BASE64;
use base64::Engine;
use serde::{Deserialize, Serialize};
use serde_json::json;
use solana_keychain::{Signer, SolanaSigner};
use solana_sdk::transaction::Transaction;

use crate::signers::Registry;

pub type SharedRegistry = Arc<Registry>;

type ApiError = (StatusCode, Json<serde_json::Value>);

#[derive(Serialize)]
struct SignerInfo {
    backend: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    address: Option<String>,
    available: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    error: Option<String>,
}

pub async fn signers(State(registry): State<SharedRegistry>) -> Json<serde_json::Value> {
    let mut infos = Vec::with_capacity(registry.len());
    for (backend, entry) in registry.iter() {
        let info = match entry {
            Ok(signer) => SignerInfo {
                backend: backend.clone(),
                address: Some(signer.pubkey().to_string()),
                available: signer.is_available().await,
                error: None,
            },
            Err(error) => SignerInfo {
                backend: backend.clone(),
                address: None,
                available: false,
                error: Some(error.clone()),
            },
        };
        infos.push(info);
    }
    Json(json!({ "signers": infos }))
}

#[derive(Deserialize, Default)]
pub struct SignMessageRequest {
    message: Option<String>,
    backend: Option<String>,
}

pub async fn sign_message(
    State(registry): State<SharedRegistry>,
    body: Option<Json<SignMessageRequest>>,
) -> Result<Json<serde_json::Value>, ApiError> {
    let Json(request) = body.unwrap_or_default();
    let message = match request.message.as_deref() {
        Some(message) if !message.is_empty() => message.to_string(),
        _ => {
            return Err(bad_request(
                "Body must be { message: string, backend?: string }",
            ))
        }
    };
    let signer = find_signer(&registry, request.backend.as_deref())?;
    let signature = signer
        .sign_message(message.as_bytes())
        .await
        .map_err(internal_error)?;
    Ok(Json(json!({
        "address": signer.pubkey().to_string(),
        "signature": signature.to_string(),
    })))
}

#[derive(Deserialize, Default)]
pub struct SignTransactionRequest {
    transaction: Option<String>,
    backend: Option<String>,
}

pub async fn sign_transaction(
    State(registry): State<SharedRegistry>,
    body: Option<Json<SignTransactionRequest>>,
) -> Result<Json<serde_json::Value>, ApiError> {
    let Json(request) = body.unwrap_or_default();
    let wire_transaction =
        match request.transaction.as_deref() {
            Some(transaction) if !transaction.is_empty() => transaction.to_string(),
            _ => return Err(bad_request(
                "Body must be { transaction: string, backend?: string } (base64 wire transaction)",
            )),
        };
    let signer = find_signer(&registry, request.backend.as_deref())?;
    let mut transaction: Transaction = BASE64
        .decode(&wire_transaction)
        .ok()
        .and_then(|bytes| bincode::deserialize(&bytes).ok())
        .ok_or_else(|| bad_request("Invalid base64 wire transaction"))?;
    let (signed_transaction, signature) = signer
        .sign_transaction(&mut transaction)
        .await
        .map_err(internal_error)?
        .into_signed_transaction();
    Ok(Json(json!({
        "address": signer.pubkey().to_string(),
        "signature": signature.to_string(),
        "transaction": signed_transaction,
    })))
}

#[derive(Deserialize, Default)]
pub struct DemoTransactionRequest {
    memo: Option<String>,
    backend: Option<String>,
}

pub async fn demo_transaction(
    State(registry): State<SharedRegistry>,
    body: Option<Json<DemoTransactionRequest>>,
) -> Result<Json<serde_json::Value>, ApiError> {
    let Json(request) = body.unwrap_or_default();
    let memo = match request.memo.as_deref() {
        Some(memo) if !memo.is_empty() => memo.to_string(),
        _ => {
            return Err(bad_request(
                "Body must be { memo: string, backend?: string }",
            ))
        }
    };
    let signer = find_signer(&registry, request.backend.as_deref())?;
    let payer = signer.pubkey();
    let instruction = spl_memo::build_memo(memo.as_bytes(), &[]);
    let mut transaction = Transaction::new_with_payer(&[instruction], Some(&payer));
    let (signed_transaction, signature) = signer
        .sign_transaction(&mut transaction)
        .await
        .map_err(internal_error)?
        .into_signed_transaction();
    let signature_valid = signature.verify(payer.as_ref(), &transaction.message_data());
    let decoded_memo = transaction
        .message
        .instructions
        .first()
        .map(|instruction| String::from_utf8_lossy(&instruction.data).to_string())
        .unwrap_or_default();
    Ok(Json(json!({
        "feePayer": payer.to_string(),
        "blockhash": transaction.message.recent_blockhash.to_string(),
        "memo": decoded_memo,
        "signature": signature.to_string(),
        "signatureValid": signature_valid,
        "transaction": signed_transaction,
    })))
}

fn find_signer<'a>(registry: &'a Registry, backend: Option<&str>) -> Result<&'a Signer, ApiError> {
    let name = backend.unwrap_or(&registry[0].0);
    let configured = registry
        .iter()
        .map(|(name, _)| name.as_str())
        .collect::<Vec<_>>()
        .join(", ");
    match registry.iter().find(|(entry, _)| entry == name) {
        Some((_, Ok(signer))) => Ok(signer),
        Some((_, Err(error))) => Err(bad_request(error)),
        None => Err(bad_request(&format!(
            "Backend \"{name}\" is not configured. Configured backends: {configured}"
        ))),
    }
}

fn bad_request(message: &str) -> ApiError {
    (StatusCode::BAD_REQUEST, Json(json!({ "error": message })))
}

fn internal_error(error: solana_keychain::SignerError) -> ApiError {
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(json!({ "error": error.to_string() })),
    )
}
