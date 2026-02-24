use axum::extract::{Path, Query, State};
use axum::routing::get;
use axum::{Json, Router};
use solana_client::nonblocking::rpc_client::RpcClient;
use std::collections::HashMap;
use std::sync::Arc;

use crate::actions::donate::{DonateAction, DonateMemoAction};
use crate::actions::swap::SwapAction;
use crate::actions::transfer::TransferAction;
use crate::actions::ActionRegistry;
use crate::cors::actions_cors;
use tower_http::trace::TraceLayer;
use crate::error::AppError;
use crate::register_actions;
use crate::spec::{ActionGetResponse, ActionPostRequest, ActionPostResponse, ActionsJson};

pub struct AppState {
    pub rpc: Arc<RpcClient>,
    pub registry: ActionRegistry,
    pub actions_json: ActionsJson,
}

pub fn build_router(rpc: Arc<RpcClient>) -> Router {
    let registry = register_actions![TransferAction, SwapAction, DonateAction, DonateMemoAction];
    let actions_json = registry.build_actions_json();
    let state = Arc::new(AppState {
        rpc,
        registry,
        actions_json,
    });

    Router::new()
        .route("/actions.json", get(get_actions_json))
        .route(
            "/api/actions/{*path}",
            get(handle_action_get).post(handle_action_post),
        )
        .layer(actions_cors())
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(|req: &axum::http::Request<_>| {
                    tracing::info_span!(
                        "request",
                        method = %req.method(),
                        uri = %req.uri(),
                    )
                })
                .on_response(|res: &axum::http::Response<_>, latency: std::time::Duration, _span: &tracing::Span| {
                    tracing::info!(status = res.status().as_u16(), latency_ms = latency.as_millis(), "response");
                }),
        )
        .with_state(state)
}

async fn get_actions_json(State(state): State<Arc<AppState>>) -> Json<ActionsJson> {
    Json(state.actions_json.clone())
}

async fn handle_action_get(
    Path(path): Path<String>,
    State(state): State<Arc<AppState>>,
) -> Result<Json<ActionGetResponse>, AppError> {
    let action = state
        .registry
        .get(&path)
        .ok_or_else(|| AppError::NotFound(format!("Action not found: {path}")))?;

    action.metadata(&state.rpc).await.map(Json)
}

async fn handle_action_post(
    Path(path): Path<String>,
    State(state): State<Arc<AppState>>,
    Query(params): Query<HashMap<String, String>>,
    Json(body): Json<ActionPostRequest>,
) -> Result<Json<ActionPostResponse>, AppError> {
    let action = state
        .registry
        .get(&path)
        .ok_or_else(|| AppError::NotFound(format!("Action not found: {path}")))?;

    let account = body
        .account
        .parse()
        .map_err(|_| AppError::BadRequest("Invalid account pubkey".into()))?;

    action.execute(&state.rpc, account, params).await.map(Json)
}
