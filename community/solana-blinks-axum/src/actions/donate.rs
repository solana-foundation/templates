use async_trait::async_trait;
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_sdk::message::Message;
use solana_sdk::pubkey::Pubkey;
use solana_sdk::transaction::Transaction;
use solana_system_interface::instruction::transfer;
use std::collections::HashMap;

use crate::actions::{
    build_memo_tx, get_param, lamports_to_sol, serialize_tx, sol_to_lamports, Action,
};
use crate::consts::{DONATE_TREASURY, LAMPORTS_PER_SIGNATURE, SOLANA_LOGO_URL};
use crate::error::AppError;
use crate::spec::{
    ActionGetResponse, ActionParameter, ActionPostResponse, LinkedAction, NextAction,
    NextActionLinks,
};
use crate::state::ChainState;

pub struct DonateAction;

#[async_trait]
impl Action for DonateAction {
    fn path(&self) -> &'static str {
        "donate"
    }

    async fn metadata(&self, _rpc: &RpcClient) -> Result<ActionGetResponse, AppError> {
        Ok(ActionGetResponse::new(
            SOLANA_LOGO_URL,
            "Donate SOL",
            "Send a SOL donation and leave an on-chain message",
            "Donate",
        )
        .with_links(vec![
            LinkedAction {
                href: "/api/actions/donate?amount=0.1".into(),
                label: "0.1 SOL".into(),
                parameters: None,
            },
            LinkedAction {
                href: "/api/actions/donate?amount=0.5".into(),
                label: "0.5 SOL".into(),
                parameters: None,
            },
            LinkedAction {
                href: "/api/actions/donate?amount={amount}".into(),
                label: "Donate".into(),
                parameters: Some(vec![ActionParameter::number(
                    "amount",
                    "Amount (SOL)",
                    true,
                )
                .with_min(0.001)]),
            },
        ]))
    }

    async fn execute(
        &self,
        rpc: &RpcClient,
        account: Pubkey,
        params: HashMap<String, String>,
    ) -> Result<ActionPostResponse, AppError> {
        let amount: f64 = get_param(&params, "amount")?;
        let lamports = sol_to_lamports(amount);

        let (balance_res, blockhash_res) =
            tokio::join!(rpc.get_balance(&account), rpc.get_latest_blockhash(),);

        let balance = balance_res?;
        if balance < lamports + 2 * LAMPORTS_PER_SIGNATURE {
            return Err(AppError::BadRequest(format!(
                "Insufficient balance: you have {} SOL but need {} SOL + fees",
                lamports_to_sol(balance),
                amount,
            )));
        }

        let ix = transfer(&account, &DONATE_TREASURY, lamports);
        let blockhash = blockhash_res?;
        let msg = Message::new_with_blockhash(&[ix], Some(&account), &blockhash);
        let transaction = serialize_tx(&Transaction::new_unsigned(msg))?;

        let mut state = ChainState::new();
        state.set("amount", &amount.to_string());
        let next_href = state.encode_into("/api/actions/donate/memo");

        Ok(ActionPostResponse {
            transaction,
            message: Some(format!("Donated {amount} SOL")),
            links: Some(NextActionLinks {
                next: NextAction::Inline {
                    action: ActionGetResponse::new(
                        SOLANA_LOGO_URL,
                        "Leave a Message",
                        &format!("{amount} SOL donation confirmed. Leave an on-chain memo!"),
                        "Post Message",
                    )
                    .with_links(vec![LinkedAction {
                        href: format!("{next_href}&memo={{memo}}"),
                        label: "Post Message".into(),
                        parameters: Some(vec![ActionParameter::text("memo", "Your message", true)]),
                    }]),
                },
            }),
        })
    }
}

pub struct DonateMemoAction;

#[async_trait]
impl Action for DonateMemoAction {
    fn path(&self) -> &'static str {
        "donate/memo"
    }

    async fn metadata(&self, _rpc: &RpcClient) -> Result<ActionGetResponse, AppError> {
        Ok(ActionGetResponse::new(
            SOLANA_LOGO_URL,
            "Donation Memo",
            "Reached via the donate chain flow",
            "Post Memo",
        ))
    }

    async fn execute(
        &self,
        rpc: &RpcClient,
        account: Pubkey,
        params: HashMap<String, String>,
    ) -> Result<ActionPostResponse, AppError> {
        let state = ChainState::decode_from(&params)?;
        let amount = state.get("amount")?;
        let memo_text: String = get_param(&params, "memo")?;

        let transaction =
            build_memo_tx(rpc, &account, &format!("donation:{amount}SOL:{memo_text}")).await?;

        Ok(ActionPostResponse {
            transaction,
            message: Some(format!("Memo posted: \"{memo_text}\"")),
            links: None,
        })
    }
}
