use actix_web::{get, HttpResponse};
use serde_json::json;

#[get("/free")]
pub async fn free_endpoint() -> HttpResponse {
    log::info!("Received request to /api/free");
    HttpResponse::Ok().json(json!({
        "message": "This is a free endpoint - no payment required!",
        "data": "You can access this without paying"
    }))
}
