use axum::Json;
use serde_json::{json, Value};

pub async fn free_endpoint() -> Json<Value> {
    log::info!("Received request to /api/free");
    Json(json!({
        "message": "This is a free endpoint - no payment required!",
        "data": "You can access this without paying"
    }))
}
