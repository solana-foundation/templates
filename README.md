# solana-templates

Official templates for the [create-solana-dapp](https://github.com/solana-developers/create-solana-dapp) CLI.

<!-- Test edit for GitHub Actions fork testing -->

## Usage

Run the `create-solana-dapp` command and use the interactive prompts to create a new project.

Provide the `-t <template-name>` option to use a specific template, use `--help` to see all the options.

```sh
# npm
npm create solana-dapp@latest [-t <template-name>]

# pnpm
pnpm create solana-dapp@latest [-t <template-name>]

# yarn
yarn create-solana-dapp [-t <template-name>]
```

<!-- automd:file src="TEMPLATES.md" -->

# Templates

Templates using gill (based on @solana/kit)

### [template-next-tailwind](templates/template-next-tailwind)

> Next.js, Tailwind, gill (based on @solana/kit), Wallet UI

`gill` `nextjs` `react` `solana-kit` `tailwind` `typescript` `wallet-ui`

### [template-next-tailwind-basic](templates/template-next-tailwind-basic)

> Next.js, Tailwind, basic Anchor example, gill (based on @solana/kit), Wallet UI

`anchor-basic` `gill` `nextjs` `react` `solana-kit` `tailwind` `typescript` `wallet-ui`

### [template-next-tailwind-counter](templates/template-next-tailwind-counter)

> Next.js, Tailwind, Anchor Counter example, gill (based on @solana/kit), Wallet UI

`anchor-counter` `gill` `nextjs` `react` `solana-kit` `tailwind` `typescript` `wallet-ui`

### [template-node-express](templates/template-node-express)

> Node.js Express API with gill (based on @solana/kit)

`express` `gill` `node` `solana-kit`

### [template-node-script](templates/template-node-script)

> Node.js script with gill (based on @solana/kit)

`gill` `node` `solana-kit`

### [template-react-vite-tailwind](templates/template-react-vite-tailwind)

> React+Vite, Tailwind, gill (based on @solana/kit), Wallet UI

`gill` `react` `solana-kit` `tailwind` `typescript` `vite` `wallet-ui`

### [template-react-vite-tailwind](templates/template-react-vite-tailwind)

> React+Vite, Tailwind, gill (based on @solana/kit), basic Anchor example, Wallet UI

`anchor-basic` `gill` `react` `solana-kit` `tailwind` `typescript` `vite` `wallet-ui`

### [template-react-vite-tailwind](templates/template-react-vite-tailwind)

> React+Vite, Tailwind, gill (based on @solana/kit), Anchor Counter example, Wallet UI

`anchor-counter` `gill` `react` `solana-kit` `tailwind` `typescript` `vite` `wallet-ui`

# Legacy Templates

Legacy templates using @solana/web3.js

### [legacy-next-tailwind](legacy/legacy-next-tailwind)

> Next.js, Tailwind, @solana/web3.js, Wallet Adapter

`legacy` `nextjs` `react` `solana-web3js` `tailwind` `typescript` `wallet-adapter`

### [legacy-next-tailwind-basic](legacy/legacy-next-tailwind-basic)

> Next.js, Tailwind, @solana/web3.js, Wallet Adapter, basic Anchor program

`anchor-basic` `legacy` `nextjs` `react` `solana-web3js` `tailwind` `typescript` `wallet-adapter`

### [legacy-next-tailwind-counter](legacy/legacy-next-tailwind-counter)

> Next.js, Tailwind, @solana/web3.js, Wallet Adapter, Anchor Counter program

`anchor-counter` `legacy` `nextjs` `react` `solana-web3js` `tailwind` `typescript` `wallet-adapter`

### [legacy-react-vite-tailwind](legacy/legacy-react-vite-tailwind)

> React + Vite, Tailwind, @solana/web3.js, Wallet Adapter

`legacy` `react` `solana-web3js` `tailwind` `typescript` `vite` `wallet-adapter`

### [legacy-react-vite-tailwind](legacy/legacy-react-vite-tailwind)

> React + Vite, Tailwind, @solana/web3.js, Wallet Adapter, basic Anchor program

`anchor-basic` `legacy` `react` `solana-web3js` `tailwind` `typescript` `vite` `wallet-adapter`

### [legacy-react-vite-tailwind](legacy/legacy-react-vite-tailwind)

> React + Vite, Tailwind, @solana/web3.js, Wallet Adapter, Anchor Counter program

`anchor-counter` `legacy` `react` `solana-web3js` `tailwind` `typescript` `vite` `wallet-adapter`

<!-- /automd -->

## Contributors

<!-- automd:contributors github="solana-developers/solana-templates" license="MIT" -->

Published under the [MIT](https://github.com/solana-developers/solana-templates/blob/main/LICENSE) license.
Made by [community](https://github.com/solana-developers/solana-templates/graphs/contributors) 💛
<br><br>
<a href="https://github.com/solana-developers/solana-templates/graphs/contributors">
<img src="https://contrib.rocks/image?repo=solana-developers/solana-templates" />
</a>

<!-- /automd -->
