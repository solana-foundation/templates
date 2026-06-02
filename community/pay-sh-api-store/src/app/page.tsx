import { GridBackground } from '@/components/grid-background'
import { CopyCommandButton } from '@/components/copy-command-button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'

const gatewayCommand = 'pay --sandbox server start pay-provider.yml --bind 127.0.0.1:1402 --debugger'
const devServerCommand = 'pnpm dev'
const protectedEndpointCommand = 'curl -i http://127.0.0.1:1402/api/insights'
const paidRetryCommand = 'PAY_API_URL=http://localhost:3000 pay --sandbox curl http://127.0.0.1:1402/api/insights'

const endpoints = [
  {
    name: 'Insight brief',
    path: '/api/insights',
    price: '$0.01',
    description: 'A compact market-style brief with signal, confidence, and recommended next action.',
    method: 'GET',
    status: 'Metered',
    command: paidRetryCommand,
  },
  {
    name: 'Usage report',
    path: '/api/report',
    price: '$0.02',
    description: 'A metered API report with usage totals, paid requests, revenue, and p95 latency.',
    method: 'GET',
    status: 'Metered',
    command: 'PAY_API_URL=http://localhost:3000 pay --sandbox curl http://127.0.0.1:1402/api/report',
  },
  {
    name: 'Health check',
    path: '/api/health',
    price: 'Free',
    description: 'A free endpoint exposed through the same gateway for smoke tests and uptime checks.',
    method: 'GET',
    status: 'Free',
    command: 'curl -i http://127.0.0.1:1402/api/health',
  },
]

const steps = [
  'Run the Next.js app on localhost:3000 as the upstream API.',
  'Start the Pay.sh sandbox gateway on 127.0.0.1:1402 from pay-provider.yml.',
  'Use PAY_API_URL=http://localhost:3000 so Pay.sh can select the local sandbox USDC challenge.',
]

const setupCommands = [
  {
    label: 'Terminal 1',
    title: 'Start the Next.js upstream API',
    command: devServerCommand,
    note: 'Run this from the generated project root. It keeps the API routes available at localhost:3000.',
  },
  {
    label: 'Terminal 2',
    title: 'Start the Pay.sh sandbox gateway',
    command: gatewayCommand,
    note: 'Run this from the same project root so Pay.sh can read pay-provider.yml.',
  },
  {
    label: 'Terminal 3',
    title: 'Run a full sandbox paid retry',
    command: paidRetryCommand,
    note: 'Uses the local balance shim so the Pay.sh CLI can complete the sandbox USDC payment without real funds.',
  },
]

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <GridBackground />
      <div className="relative z-10">
        <header className="mx-auto flex max-w-6xl items-center px-6 py-4">
          <Link href="/" className="text-xl font-bold tracking-tight transition hover:opacity-80">
            Pay.sh API Store
          </Link>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-16">
          <section className="pt-6 pb-20 md:pt-8 md:pb-32">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <h1 className="font-black tracking-tight text-foreground">
                <span className="block text-7xl md:text-8xl">Pay.sh</span>
                <span className="block text-5xl md:text-6xl">API Store</span>
              </h1>
              <div className="flex max-w-lg flex-col gap-3">
                <p className="text-base leading-relaxed text-foreground/50">
                  Sell API endpoints from a normal Next.js App Router service. Pay.sh runs as a sandbox gateway in front
                  of the app, returns HTTP 402 for metered routes, and forwards only verified paid requests to your API.
                </p>
                <p className="text-base leading-relaxed text-foreground/50">
                  This template is designed for agent-callable data products: price each endpoint, publish the gateway
                  URL, and let Pay.sh handle payment challenges with Surfpool-funded sandbox USDC.
                </p>
                <a
                  href="https://pay.sh/docs/accept-payments/provider-spec"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-foreground/70 underline underline-offset-4 transition-colors hover:text-foreground"
                >
                  Read provider spec docs -&gt;
                </a>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide text-muted uppercase">Start here</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight">Run the gateway before paid calls</h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                  These commands need the{' '}
                  <a
                    href="https://pay.sh/docs/get-started"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground/80 underline underline-offset-4 transition-colors hover:text-foreground"
                  >
                    Pay.sh CLI
                  </a>{' '}
                  installed on your PATH. Run <code className="font-mono text-xs text-foreground">pay --help</code> to
                  verify before continuing.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border-[0.5px] border-border-low bg-card p-6 shadow-[0_20px_80px_-50px_rgba(0,0,0,0.35)]">
              <ol className="relative grid gap-8 before:absolute before:top-5 before:bottom-5 before:left-4 before:w-px before:bg-border-low">
                {setupCommands.map((item, index) => (
                  <li key={item.label} className="relative grid gap-4 pl-12 lg:grid-cols-[16rem_1fr] lg:items-start">
                    <span className="absolute top-0 left-0 z-10 flex size-8 items-center justify-center rounded-full bg-primary font-mono text-xs font-semibold text-primary-foreground">
                      {index + 1}
                    </span>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold tracking-wide text-muted uppercase">{item.label}</p>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="text-sm leading-relaxed text-muted">{item.note}</p>
                    </div>
                    <div className="rounded-xl border-[0.5px] border-border-low bg-cream p-4">
                      <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm leading-6 text-foreground">
                        <code>{item.command}</code>
                      </pre>
                      <div className="mt-4 flex justify-end">
                        <CopyCommandButton command={item.command} label={`Copy ${item.title} command`} />
                      </div>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-8 grid gap-4 rounded-xl border-[0.5px] border-border-low bg-cream p-4 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="text-sm font-semibold">No-funds protection check</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    Plain curl still returns HTTP 402, which confirms the gateway is enforcing payment before the paid
                    route reaches Next.js.
                  </p>
                  <code className="mt-3 block font-mono text-xs text-foreground/80">{protectedEndpointCommand}</code>
                </div>
                <CopyCommandButton command={protectedEndpointCommand} label="Copy protection check command" />
              </div>
            </div>
          </section>

          <section className="space-y-6 pt-16">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide text-muted uppercase">Endpoint pricing</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight">Metered APIs, priced by endpoint</h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-muted">
                Each row maps to one entry in{' '}
                <span className="font-mono text-xs text-foreground">pay-provider.yml</span>.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border-[0.5px] border-border-low bg-card shadow-[0_20px_80px_-50px_rgba(0,0,0,0.35)]">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Method</TableHead>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Access</TableHead>
                      <TableHead className="min-w-[22rem]">Command</TableHead>
                      <TableHead className="w-24 text-right">Copy</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {endpoints.map((endpoint) => (
                      <TableRow key={endpoint.path}>
                        <TableCell className="font-mono text-xs text-muted">{endpoint.method}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-mono text-xs text-foreground">{endpoint.path}</p>
                            <p className="text-sm font-medium">{endpoint.name}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm font-semibold tabular-nums">{endpoint.price}</TableCell>
                        <TableCell>
                          <Badge variant={endpoint.status === 'Free' ? 'success' : 'default'}>{endpoint.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <p className="mb-2 max-w-md text-sm leading-relaxed text-muted">{endpoint.description}</p>
                          {endpoint.status !== 'Free' ? (
                            <p className="mb-2 text-xs font-medium text-muted">
                              Requires the gateway and the local PAY_API_URL balance shim.
                            </p>
                          ) : null}
                          <code className="block max-w-xl truncate font-mono text-xs text-foreground/80">
                            {endpoint.command}
                          </code>
                        </TableCell>
                        <TableCell className="text-right">
                          <CopyCommandButton command={endpoint.command} label={`Copy ${endpoint.name} command`} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </section>

          <section className="pt-16">
            <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="rounded-2xl border-[0.5px] border-border-low bg-card p-6 shadow-[0_20px_80px_-50px_rgba(0,0,0,0.35)]">
                <p className="text-xs font-semibold tracking-wide text-muted uppercase">Flow</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight">The gateway sits between pay and Next.js</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  Direct requests to paid endpoints return HTTP 402. With PAY_API_URL pointed at this app, Pay.sh can
                  parse the challenge, select sandbox USDC, and retry with a payment proof.
                </p>
              </div>

              <ol className="grid gap-4">
                {steps.map((step, index) => (
                  <li key={step} className="rounded-2xl border-[0.5px] border-border-low bg-card p-6 shadow-sm">
                    <div className="flex gap-4">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-xs font-semibold text-primary-foreground">
                        {index + 1}
                      </span>
                      <p className="pt-1 text-sm leading-relaxed text-muted">{step}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
