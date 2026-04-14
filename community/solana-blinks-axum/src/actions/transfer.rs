use async_trait::async_trait;
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_sdk::message::Message;
use solana_sdk::pubkey::Pubkey;
use solana_sdk::transaction::Transaction;
use solana_system_interface::instruction as system_instruction;
use std::collections::HashMap;

use crate::actions::{get_param, lamports_to_sol, serialize_tx, sol_to_lamports, Action};
use crate::consts::{LAMPORTS_PER_SIGNATURE, SOLANA_LOGO_URL};
use crate::error::AppError;
use crate::spec::{ActionGetResponse, ActionParameter, ActionPostResponse, LinkedAction};

pub struct TransferAction;

#[async_trait]
impl Action for TransferAction {
    fn path(&self) -> &'static str {
        "transfer"
    }

    async fn metadata(&self, _rpc: &RpcClient) -> Result<ActionGetResponse, AppError> {
        let response = ActionGetResponse::new(
            SOLANA_LOGO_URL,
            "Send SOL",
            "Transfer SOL to a specified address",
            "Send",
        )
        .with_links(vec![LinkedAction {
            href: "/api/actions/transfer?to={to}&amount={amount}".into(),
            label: "Send SOL".into(),
            parameters: Some(vec![
                ActionParameter::text("to", "Recipient address", true),
                ActionParameter::number("amount", "Amount (SOL)", true).with_min(0.001),
            ]),
        }]);

        Ok(response)
    }

    async fn execute(
        &self,
        rpc: &RpcClient,
        account: Pubkey,
        params: HashMap<String, String>,
    ) -> Result<ActionPostResponse, AppError> {
        let recipient: Pubkey = get_param(&params, "to")?;
        let amount_sol: f64 = get_param(&params, "amount")?;

        if amount_sol < 0.001 {
            return Err(AppError::BadRequest(
                "Amount must be at least 0.001 SOL".into(),
            ));
        }

        let lamports = sol_to_lamports(amount_sol);

        // fire all independent RPC reads concurrently
        let (balance_res, account_res, blockhash_res) = tokio::join!(
            rpc.get_balance(&account),
            rpc.get_account(&recipient),
            rpc.get_latest_blockhash(),
        );

        let balance = balance_res?;
        if balance < lamports + LAMPORTS_PER_SIGNATURE {
            return Err(AppError::BadRequest(format!(
                "Insufficient balance: you have {} SOL but need {} SOL + fees",
                lamports_to_sol(balance),
                amount_sol,
            )));
        }

        let recipient_exists = match account_res {
            Ok(_) => true,
            Err(err)
                if err.to_string().contains("AccountNotFound")
                    || err.to_string().contains("could not find account") =>
            {
                false
            }
            Err(err) => return Err(err.into()),
        };

        if !recipient_exists {
            let min_rent = rpc.get_minimum_balance_for_rent_exemption(0).await?;
            if lamports < min_rent {
                return Err(AppError::BadRequest(format!(
                    "Recipient account doesn't exist. Transfer at least {} SOL to cover rent exemption",
                    lamports_to_sol(min_rent),
                )));
            }
        }

        let ix = system_instruction::transfer(&account, &recipient, lamports);
        let blockhash = blockhash_res?;
        let msg = Message::new_with_blockhash(&[ix], Some(&account), &blockhash);
        let transaction = serialize_tx(&Transaction::new_unsigned(msg))?;

        Ok(ActionPostResponse {
            transaction,
            message: Some(format!("Sending {amount_sol} SOL to {recipient}")),
            links: None,
        })
    }
}
