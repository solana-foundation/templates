use async_trait::async_trait;
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_sdk::pubkey::Pubkey;
use std::collections::{BTreeSet, HashMap};

use crate::error::AppError;
use crate::spec::{ActionGetResponse, ActionPostResponse, ActionRule, ActionsJson};

#[async_trait]
pub trait Action: Send + Sync {
    fn path(&self) -> &'static str;

    async fn metadata(&self, rpc: &RpcClient) -> Result<ActionGetResponse, AppError>;

    async fn execute(
        &self,
        rpc: &RpcClient,
        account: Pubkey,
        params: HashMap<String, String>,
    ) -> Result<ActionPostResponse, AppError>;
}

pub struct ActionRegistry {
    pub(crate) actions: HashMap<String, Box<dyn Action>>,
}

#[macro_export]
macro_rules! register_actions {
    ($($action:expr),+ $(,)?) => {{
        use $crate::actions::Action as _;
        let mut registry = $crate::actions::ActionRegistry::new();
        $({
            let a = $action;
            registry.actions.insert(a.path().into(), Box::new(a));
        })+
        registry
    }};
}

impl ActionRegistry {
    pub fn new() -> Self {
        Self {
            actions: HashMap::new(),
        }
    }

    pub fn get(&self, path: &str) -> Option<&dyn Action> {
        self.actions.get(path).map(|a| a.as_ref())
    }

    pub fn build_actions_json(&self) -> ActionsJson {
        let mut paths = BTreeSet::new();
        for key in self.actions.keys() {
            if let Some((parent, _)) = key.rsplit_once('/') {
                paths.insert(format!("/api/actions/{parent}/*"));
            } else {
                paths.insert(format!("/api/actions/{key}"));
            }
        }
        ActionsJson {
            rules: paths
                .into_iter()
                .map(|p| ActionRule {
                    path_pattern: p.clone(),
                    api_path: p,
                })
                .collect(),
        }
    }
}
