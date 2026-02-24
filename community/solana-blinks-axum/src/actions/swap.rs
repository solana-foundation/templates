use async_trait::async_trait;
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_sdk::pubkey::Pubkey;
use std::collections::HashMap;

use crate::actions::{build_memo_tx, get_param, lamports_to_sol, sol_to_lamports, Action};
use crate::consts::{LAMPORTS_PER_SIGNATURE, SOLANA_LOGO_URL};
use crate::error::AppError;
use crate::spec::{
    ActionGetResponse, ActionParameter, ActionParameterOption, ActionPostResponse, LinkedAction,
};

pub struct SwapAction;

#[async_trait]
impl Action for SwapAction {
    fn path(&self) -> &'static str {
        "swap"
    }

    async fn metadata(&self, _rpc: &RpcClient) -> Result<ActionGetResponse, AppError> {
        Ok(ActionGetResponse::new(
            SOLANA_LOGO_URL,
            "Token Swap",
            "Swap tokens on Solana",
            "Swap",
        )
        .with_links(vec![LinkedAction {
            href: "/api/actions/swap?from_token={from_token}&amount={amount}".into(),
            label: "Swap".into(),
            parameters: Some(vec![
                ActionParameter::select(
                    "from_token",
                    "Token to sell",
                    vec![
                        ActionParameterOption::new("SOL", "SOL"),
                        ActionParameterOption::new("USDC", "USDC"),
                        ActionParameterOption::new("BONK", "BONK"),
                    ],
                ),
                ActionParameter::number("amount", "Amount", true).with_min(0.001),
            ]),
        }]))
    }

    async fn execute(
        &self,
        rpc: &RpcClient,
        account: Pubkey,
        params: HashMap<String, String>,
    ) -> Result<ActionPostResponse, AppError> {
        let from_token: String = get_param(&params, "from_token")?;
        let amount: f64 = get_param(&params, "amount")?;

        if from_token == "SOL" {
            let balance = rpc.get_balance(&account).await?;
            let lamports_needed = sol_to_lamports(amount);
            if balance < lamports_needed + 2 * LAMPORTS_PER_SIGNATURE {
                return Err(AppError::BadRequest(format!(
                    "Insufficient SOL balance: you have {} SOL",
                    lamports_to_sol(balance),
                )));
            }
        }

        // TODO: replace with actual DEX instructions (Jupiter, Raydium, etc.)
        let transaction =
            build_memo_tx(rpc, &account, &format!("swap:{from_token}:{amount}:SOL")).await?;

        Ok(ActionPostResponse {
            transaction,
            message: Some(format!("Swapping {amount} {from_token} for SOL")),
            links: None,
        })
    }
}
