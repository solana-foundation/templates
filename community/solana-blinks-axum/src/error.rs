use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;

use crate::spec::ActionError;

#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("Bad request: {0}")]
    BadRequest(String),

    #[error("Not found: {0}")]
    NotFound(String),

    #[error("RPC error: {0}")]
    Rpc(Box<solana_client::client_error::ClientError>),

    #[error("Serialization error: {0}")]
    Serialization(#[from] bincode::Error),
}

impl From<solana_client::client_error::ClientError> for AppError {
    fn from(err: solana_client::client_error::ClientError) -> Self {
        Self::Rpc(Box::new(err))
    }
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let status = match &self {
            AppError::BadRequest(_) => StatusCode::BAD_REQUEST,
            AppError::NotFound(_) => StatusCode::NOT_FOUND,
            AppError::Rpc(_) | AppError::Serialization(_) => StatusCode::INTERNAL_SERVER_ERROR,
        };

        let body = ActionError {
            message: self.to_string(),
        };

        (status, Json(body)).into_response()
    }
}
