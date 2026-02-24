use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize)]
pub struct ActionsJson {
    pub rules: Vec<ActionRule>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ActionRule {
    pub path_pattern: String,
    pub api_path: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActionGetResponse {
    #[allow(dead_code)]
    #[serde(rename = "type", skip_serializing, default = "default_action_type")]
    action_type: String,
    pub icon: String,
    pub title: String,
    pub description: String,
    pub label: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub disabled: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<ActionError>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub links: Option<ActionLinks>,
}

fn default_action_type() -> String {
    "action".into()
}

impl ActionGetResponse {
    pub fn new(icon: &str, title: &str, description: &str, label: &str) -> Self {
        Self {
            action_type: "action".into(),
            icon: icon.into(),
            title: title.into(),
            description: description.into(),
            label: label.into(),
            disabled: None,
            error: None,
            links: None,
        }
    }

    pub fn with_links(mut self, actions: Vec<LinkedAction>) -> Self {
        self.links = Some(ActionLinks { actions });
        self
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActionLinks {
    pub actions: Vec<LinkedAction>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LinkedAction {
    pub href: String,
    pub label: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub parameters: Option<Vec<ActionParameter>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActionParameter {
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub label: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub required: Option<bool>,
    #[serde(rename = "type", skip_serializing_if = "Option::is_none")]
    pub parameter_type: Option<ActionParameterType>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub pattern: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub pattern_description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub min: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub max: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub options: Option<Vec<ActionParameterOption>>,
}

impl ActionParameter {
    pub fn text(name: &str, label: &str, required: bool) -> Self {
        Self {
            name: name.into(),
            label: Some(label.into()),
            required: Some(required),
            parameter_type: Some(ActionParameterType::Text),
            pattern: None,
            pattern_description: None,
            min: None,
            max: None,
            options: None,
        }
    }

    pub fn number(name: &str, label: &str, required: bool) -> Self {
        Self {
            parameter_type: Some(ActionParameterType::Number),
            ..Self::text(name, label, required)
        }
    }

    pub fn with_min(mut self, min: f64) -> Self {
        self.min = Some(min);
        self
    }

    pub fn radio(name: &str, label: &str, options: Vec<ActionParameterOption>) -> Self {
        Self {
            name: name.into(),
            label: Some(label.into()),
            required: Some(true),
            parameter_type: Some(ActionParameterType::Radio),
            pattern: None,
            pattern_description: None,
            min: None,
            max: None,
            options: Some(options),
        }
    }

    pub fn select(name: &str, label: &str, options: Vec<ActionParameterOption>) -> Self {
        Self {
            parameter_type: Some(ActionParameterType::Select),
            ..Self::radio(name, label, options)
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ActionParameterType {
    Text,
    Email,
    Url,
    Number,
    Date,
    Datetime,
    Radio,
    Select,
    Checkbox,
    Textarea,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActionParameterOption {
    pub label: String,
    pub value: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub selected: Option<bool>,
}

impl ActionParameterOption {
    pub fn new(label: &str, value: &str) -> Self {
        Self {
            label: label.into(),
            value: value.into(),
            selected: None,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActionPostRequest {
    pub account: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActionPostResponse {
    pub transaction: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub links: Option<NextActionLinks>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NextActionLinks {
    pub next: NextAction,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "lowercase")]
pub enum NextAction {
    Inline {
        #[serde(flatten)]
        action: ActionGetResponse,
    },
    Post {
        href: String,
    },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActionError {
    pub message: String,
}
