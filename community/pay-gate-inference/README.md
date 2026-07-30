# Monetize Inference with Pay.sh

Open models let you run inference on compute you own. [Pay.sh](https://pay.sh) lets you charge for it without signing up for a billing platform or forcing users through accounts, API keys, and subscriptions. This template connects the two: define input and output token rates in [paywall.yml](paywall.yml), let users pay for consumption with stablecoins, and test the full flow safely in a sandbox.

## How it works

```text
plain curl ─────POST────▶ Pay.sh gateway ──402──▶ blocked before inference
pay curl ──────POST────▶ Pay.sh gateway ───────▶ local model
                           x402-upto           local inference engine
```

1. Pay.sh discovers your local engine and exposes its OpenAI-compatible API through a payment gateway.
2. An unsigned inference request receives `HTTP 402 Payment Required` before the model runs. Health and model-listing endpoints remain free.
3. `pay --sandbox curl` accepts the payment terms with disposable sandbox stablecoins and retries the same request.
4. After inference, Pay.sh settles the actual input and output token cost using the rates in [paywall.yml](paywall.yml).

The gateway and inference engine bind to loopback by default. No JavaScript dependencies or API keys are required.

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

Start Ollama, list any installed models, and pull the small 523 MB model used by [request.json](request.json):

```bash
ollama serve
ollama list
ollama pull qwen3:0.6b
```

If the Ollama desktop app is already running, only the `pull` command is needed.

Start the Pay.sh gateway in terminal one:

```bash
pay gate inference \
  paywall.yml \
  --providers ollama \
  --sandbox
```

This asks Pay.sh to discover Ollama and apply the token rates in [paywall.yml](paywall.yml).

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

Review the sandbox terms shown by Pay.sh before authorizing. The final JSON response comes from your local model. Open the gateway UI at <http://127.0.0.1:1402/>; Pay.sh redirects that URL to the UI.

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

The `--llamacpp` generator option sets the model in [request.json](request.json) to `local-model`. If you use another `--alias`, update that model value. Then select Pay's built-in llama.cpp provider:

```bash
pay gate inference \
  paywall.yml \
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

The generated project includes an Ansible deployment under `deploy/llamacpp`. It builds a pinned llama.cpp release with native CPU optimizations, downloads the model, keeps `llama-server` on a private loopback port, installs Pay.sh, and exposes only the sandbox payment gateway.

Install Ansible and `just` on your development machine, then create your local inventory:

```bash
brew install ansible just
just setup
```

Edit `deploy/llamacpp/ansible/inventory.yml` with your Ubuntu host and SSH user. The file is ignored by Git. Inspect the server before choosing model and runtime settings:

```bash
just specs ubuntu@<host>
```

The defaults in `deploy/llamacpp/ansible/group_vars/all.yml` run the same `local-model` used by [request.json](request.json). Replace the Hugging Face repository, llama.cpp release, thread count, context, parallel slots, gateway URL, or token prices for your hardware.

Review and apply the playbook:

```bash
just check
just deploy
```

The playbook installs and starts two systemd services:

- `llama-server` listens only on `127.0.0.1:8081`.
- `pay-gateway` listens on port `8080` and is the only public inference route.

Test the deployed gateway from your development machine:

```bash
# Must return HTTP 402 without running inference
curl --include \
  http://<host>:8080/v1/chat/completions \
  --json @request.json
```

Sandbox funds and their local validator live on the inference host. Run the paid test there so the payer and gateway share that sandbox:

```bash
just paid-test ubuntu@<host>
```

Use `just gate-test <host>` to repeat the unpaid check, or `just logs <host>` and `just gateway-logs <host>` to follow either service. The deployment intentionally stays in sandbox mode. Before accepting real stablecoins, add a domain and TLS, remove `--sandbox` only when mainnet token metering is supported, review firewall and payment settings, and set `pay_public_url` to the final HTTPS URL.

## Use another inference engine

Pay.sh can also discover LM Studio, vLLM, and exo:

```bash
pay gate inference --providers lm-studio ...
pay gate inference --providers vllm ...
pay gate inference --providers exo ...
```

Ollama and llama.cpp have generator presets because they require different model IDs and gateway hostnames. For another engine, update [request.json](request.json) with a model it serves and pass the corresponding provider slug to Pay.sh.

## Set token prices

The default rates in [paywall.yml](paywall.yml) are:

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

## Security and approval boundaries

- All examples use `--sandbox`; the gateway refuses non-localnet payment configuration.
- The local quickstarts bind the gateway to `127.0.0.1:1402`. The Ubuntu playbook binds its sandbox gateway to `0.0.0.0:8080`, opens only SSH and that port, and keeps `llama-server` on loopback. Add TLS and review the exposure plan before adapting it beyond sandbox testing.
- The local engines shown here have no authentication and must remain on loopback.
- Plain `curl` makes an unsigned request only. It never invokes Pay.sh or a signer.
- `pay --sandbox curl` handles payment authorization and retry. Review the displayed recipient, maximum amount, asset, and network before approving.
- Model prompts and responses are forwarded to the selected local engine. Sandbox settlement may use Pay's configured localnet RPC infrastructure.
- No private key, seed phrase, API token, or wallet file belongs in this project.
- Stop the gateway to remove access. Use `pay account --help` to inspect or remove locally stored sandbox account state.

This template and its Ubuntu provisioning are sandbox development harnesses, not a production custody or mainnet inference deployment.

## Pay resources

- [Pay.sh](https://pay.sh) — Browse pay-per-use APIs and see how Pay.sh works.
- [Getting started](https://pay.sh/docs/building-with-pay/getting-started) — Gate a local API with Pay.sh and test its first paid request.
- [Deployment overview](https://pay.sh/docs/building-with-pay/deployment/overview) — Compare Vercel and Cloud Run deployment paths for a hosted Pay.sh gateway.
- [Video walkthrough](https://www.youtube.com/watch?v=F_RDSUER5Jw) — Watch an end-to-end introduction to Pay.sh.
