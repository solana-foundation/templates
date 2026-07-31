# Monetize Inference with Pay.sh

Open models let you run inference on compute you own. [Pay.sh](https://pay.sh) lets you charge for it without signing up for a billing platform or forcing users through accounts, API keys, and subscriptions. This template connects the two: define input and output token rates in [rates.yml](https://github.com/solana-foundation/templates/blob/main/community/pay-gate-inference/rates.yml), let users pay for consumption with stablecoins, and test the full flow safely in a sandbox.

> [!CAUTION]
> This is a public sandbox reference implementation, not an audited production deployment. Treat the Pay gateway as an internet-facing attack surface, review [SECURITY.md](https://github.com/solana-foundation/templates/blob/main/community/pay-gate-inference/SECURITY.md), and complete your own security, legal, and compliance review before handling real traffic or funds.

## How it works

```text
plain curl ─────POST────▶ Pay.sh gateway ──402──▶ blocked before inference
pay curl ──────POST────▶ Pay.sh gateway ───────▶ local model
                           x402-upto           local inference engine
```

1. Pay.sh discovers your local engine and exposes its OpenAI-compatible API through a payment gateway.
2. An unsigned inference request receives `HTTP 402 Payment Required` before the model runs. Health and model-listing endpoints remain free.
3. `pay --sandbox curl` accepts the payment terms with disposable sandbox stablecoins and retries the same request.
4. After inference, Pay.sh settles the actual input and output token cost using the rates in [rates.yml](https://github.com/solana-foundation/templates/blob/main/community/pay-gate-inference/rates.yml).

The local quickstart binds the gateway and inference engine to loopback. No JavaScript dependencies or API keys are required.

## Start locally with Ollama

[Download and install Ollama](https://ollama.com/download), then install [Pay.sh](https://github.com/solana-foundation/pay) 0.26 or newer:

```bash
brew install pay
# or
npm install -g @solana/pay
```

Create the project. Ollama is the default engine:

```bash
pnpm create solana-dapp@latest my-inference-app \
  --template pay-gate-inference \
  --ollama
cd my-inference-app
```

Start Ollama, list any installed models, and pull the small 523 MB model used by [request.json](https://github.com/solana-foundation/templates/blob/main/community/pay-gate-inference/request.json):

```bash
ollama serve
ollama list
ollama pull qwen3:0.6b
```

If the Ollama desktop app is already running, only the `pull` command is needed.

Start the Pay.sh gateway in terminal one:

```bash
pay gate inference \
  rates.yml \
  --providers ollama \
  --sandbox
```

This asks Pay.sh to discover Ollama and apply the token rates in [rates.yml](https://github.com/solana-foundation/templates/blob/main/community/pay-gate-inference/rates.yml).

In terminal two, make the request with ordinary curl:

```bash
curl --include \
  http://ollama.localhost:1402/v1/chat/completions \
  --json @request.json
```

The response must be `HTTP/1.1 402 Payment Required`. The model does not run and no payment is signed.

Now make the identical request through Pay.sh:

```bash
pay --sandbox curl \
  http://ollama.localhost:1402/v1/chat/completions \
  --json @request.json
```

Review the sandbox terms shown by Pay.sh before authorizing. The final JSON response comes from your local model.

The local gateway also exposes a web UI at <http://127.0.0.1:1402/>. Open it to watch requests and payments arrive in real time, from the initial `402` challenge through the paid retry and delivered response.

![Pay inference dashboard showing a completed payment flow](https://raw.githubusercontent.com/solana-foundation/templates/main/community/pay-gate-inference/assets/pay-inference-dashboard.png)

## Use llama.cpp instead

Generate the llama.cpp variant:

```bash
pnpm create solana-dapp@latest my-llamacpp-app \
  --template pay-gate-inference \
  --llamacpp
cd my-llamacpp-app
```

[Install a pre-built llama.cpp release](https://github.com/ggml-org/llama.cpp/blob/master/docs/install.md), then [download a GGUF model](https://github.com/ggml-org/llama.cpp#obtaining-and-quantizing-models).

Start an OpenAI-compatible server on loopback port 8080. The `--alias` value becomes the model ID:

```bash
llama-server \
  -m /path/to/model.gguf \
  --host 127.0.0.1 \
  --port 8080 \
  --alias local-model
```

The `--llamacpp` generator option sets the model in [request.json](https://github.com/solana-foundation/templates/blob/main/community/pay-gate-inference/request.json) to `local-model`. If you use another `--alias`, update that model value. Then select Pay's built-in llama.cpp provider:

```bash
pay gate inference \
  rates.yml \
  --providers llama-cpp \
  --sandbox
```

Use the provider-specific gateway hostname for both test requests:

```bash
# Must return HTTP 402
curl --include \
  http://llama-cpp.localhost:1402/v1/chat/completions \
  --json @request.json

# Handles the sandbox payment and retries
pay --sandbox curl \
  http://llama-cpp.localhost:1402/v1/chat/completions \
  --json @request.json
```

### Deploy llama.cpp to an Ubuntu CPU server

The generated project includes an Ansible deployment under `deploy/llamacpp`. It builds a pinned llama.cpp release with native CPU optimizations, verifies the model checksum, keeps inference on loopback, and exposes the sandbox Pay gateway from a dedicated non-login service account.

Install Ansible and `just` on your development machine, then create your local inventory:

```bash
brew install ansible just
just setup
```

Edit `deploy/llamacpp/ansible/inventory.yml` with your Ubuntu host and SSH user. The file is ignored by Git. Inspect the server before choosing model and runtime settings:

```bash
just specs ubuntu@<host>
```

The defaults in `deploy/llamacpp/ansible/group_vars/all.yml` run the same `local-model` used by [request.json](https://github.com/solana-foundation/templates/blob/main/community/pay-gate-inference/request.json). Replace the pinned model URL and checksum together when changing models, then tune the llama.cpp release, thread count, context, parallel slots, gateway URL, and token prices for your hardware.

Review and apply the playbook:

```bash
just check
just deploy
```

The playbook installs and starts two systemd services:

- `llama-server` listens only on `127.0.0.1:8081`.
- `pay-gateway` listens publicly on port `8080`. Its diagnostic web UI is disabled.

Run the unpaid test from your development machine:

```bash
just gate-test <host>
```

It must return `HTTP 402` without running inference. Run the paid test on the server so the payer and gateway share the sandbox account:

```bash
just paid-test ubuntu@<host>
```

To make the gateway private instead, set `pay_gateway_expose_publicly: false`, set `pay_public_url` to its loopback URL, redeploy, and forward the API over SSH:

```bash
just tunnel ubuntu@<host>
```

The public deployment does not add TLS, authentication beyond the payment challenge, rate limits, request-size limits, or DDoS protection. Keep it sandbox-only. Put a hardened HTTPS edge with abuse controls in front of the gateway and complete a threat review before handling real users or funds. Use `just logs <host>` and `just gateway-logs <host>` to follow either service.

## Set token prices

The default rates in [rates.yml](https://github.com/solana-foundation/templates/blob/main/community/pay-gate-inference/rates.yml) are:

- $0.10 per 1 million input tokens
- $0.30 per 1 million output tokens

Edit that file to set model-specific rates:

```yaml
default:
  in: 0.10
  out: 0.30
models:
  'qwen3:0.6b':
    in: 0.05
    out: 0.15
```

The paywall activates charging. Without the positional paywall or inline `--price`, `pay gate inference` is an uncharged observability proxy.

## Connect a coding harness

The `pay` command can wrap coding harnesses such as Goose, Claude Code, and Codex. This example uses Goose; follow the [Goose installation instructions](https://goose-docs.ai/docs/getting-started/installation/) before continuing:

```bash
pay goose
```

![Add a custom inference server in Pay's provider picker](https://raw.githubusercontent.com/solana-foundation/templates/main/community/pay-gate-inference/assets/pay-goose-provider-picker.png)

Add your inference server as a provider. Pay then routes Goose's inference traffic to your endpoint.

## Security notice and operator responsibility

- All examples use `--sandbox`; the gateway refuses non-localnet payment configuration.
- Local quickstarts bind both services to loopback. The Ubuntu playbook keeps llama.cpp on loopback but intentionally exposes the Pay sandbox gateway on port `8080`; UFW opens SSH and that port.
- The playbook pins the llama.cpp release commit, verifies the default GGUF SHA-256, verifies the Pay.sh release checksum, uses non-login service accounts, and applies systemd sandboxing. These controls reduce risk; they do not prove the deployment is secure.
- The inference engine has no application authentication and remains private. The public gateway is still vulnerable to scanning, denial of service, dependency flaws, and sandbox-funded compute abuse.
- The gateway root publishes provider availability, model names, and configured prices. Its diagnostic UI is disabled on the public deployment.
- Plain `curl` makes an unsigned request only. It never invokes Pay.sh or a signer.
- `pay --sandbox curl` handles payment authorization and retry. Review the displayed recipient, maximum amount, asset, and network before approving.
- Model prompts and responses are forwarded to the selected local engine. Sandbox settlement may use Pay's configured localnet RPC infrastructure.
- No private key, seed phrase, API token, or wallet file belongs in this project.
- You are responsible for host patching, SSH access, network policy, TLS, abuse controls, backups, monitoring, model licensing, privacy, sanctions, tax, and other legal or regulatory obligations.
- Stop the gateway to remove access. Use `pay account --help` as the `pay-gateway` service user to inspect or remove its sandbox account state.

This template and its Ubuntu provisioning are provided as-is under the [MIT License](https://github.com/solana-foundation/templates/blob/main/community/pay-gate-inference/LICENSE), without warranties or guarantees. They have not received a formal security audit or certification. You assume the risk of deploying or modifying them. Nothing here is legal, security, tax, or compliance advice. Read the full [security policy and deployment checklist](https://github.com/solana-foundation/templates/blob/main/community/pay-gate-inference/SECURITY.md).

## Pay resources

- [Pay.sh](https://pay.sh) — Browse pay-per-use APIs and see how Pay.sh works.
- [Getting started](https://pay.sh/docs/building-with-pay/getting-started) — Gate a local API with Pay.sh and test its first paid request.
- [Deployment overview](https://pay.sh/docs/building-with-pay/deployment/overview) — Compare Vercel and Cloud Run deployment paths for a hosted Pay.sh gateway.
- [Video walkthrough](https://www.youtube.com/watch?v=F_RDSUER5Jw) — Watch an end-to-end introduction to Pay.sh.
