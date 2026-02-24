use base64::Engine;
use std::collections::HashMap;

use crate::consts::CHAIN_PARAM;
use crate::error::AppError;

/// URL-safe base64-encoded JSON state for chained actions, passed via `_chain` query param.
#[derive(Debug, Clone, Default)]
pub struct ChainState {
    data: HashMap<String, String>,
}

impl ChainState {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn set(&mut self, key: &str, value: &str) {
        self.data.insert(key.into(), value.into());
    }

    pub fn get(&self, key: &str) -> Result<&str, AppError> {
        self.data
            .get(key)
            .map(|s| s.as_str())
            .ok_or_else(|| AppError::BadRequest(format!("Missing chain state key: {key}")))
    }

    pub fn decode_from(params: &HashMap<String, String>) -> Result<Self, AppError> {
        let encoded = params
            .get(CHAIN_PARAM)
            .ok_or_else(|| AppError::BadRequest("Missing chain state (_chain param)".into()))?;

        let bytes = base64::engine::general_purpose::URL_SAFE_NO_PAD
            .decode(encoded)
            .map_err(|e| AppError::BadRequest(format!("Invalid chain state encoding: {e}")))?;

        let data: HashMap<String, String> = serde_json::from_slice(&bytes)
            .map_err(|e| AppError::BadRequest(format!("Invalid chain state JSON: {e}")))?;

        Ok(Self { data })
    }

    pub fn encode_into(&self, base_href: &str) -> String {
        let json = serde_json::to_vec(&self.data).expect("ChainState is always serializable");
        let encoded = base64::engine::general_purpose::URL_SAFE_NO_PAD.encode(json);

        let separator = if base_href.contains('?') { "&" } else { "?" };
        format!("{base_href}{separator}{CHAIN_PARAM}={encoded}")
    }
}
