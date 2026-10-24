import config from '../../oar.config.json'

export default function Home() {
  return (
    <main className="shell">
      <div className="eyebrow">OAR APP STANDARD · DEVNET STARTER</div>
      <h1>{config.name}</h1>
      <p className="lead">Your Solana application starts with an identity, not just an address.</p>
      <section className="panel">
        <div className="tag">Setup ready — not registered</div>
        <h2>Build your application here</h2>
        <p>
          Edit <code>src/app/page.tsx</code>, then add your public domain and program addresses to{' '}
          <code>oar.config.json</code>. OAR helps users verify which programs, domain and repository actually belong to
          your application.
        </p>
      </section>
      <section className="steps">
        <div>
          <span>01</span>
          <h3>Build</h3>
          <p>Create your product using Solana tools of your choice.</p>
        </div>
        <div>
          <span>02</span>
          <h3>Prepare</h3>
          <p>
            Run <code>npm run oar:prepare -- --creator &lt;PUBLIC_ADDRESS&gt;</code>.
          </p>
        </div>
        <div>
          <span>03</span>
          <h3>Prove</h3>
          <p>Host the generated files, then authorize registration on Devnet.</p>
        </div>
      </section>
      <footer>
        <a href="https://oarprotocol.xyz/register" target="_blank" rel="noopener noreferrer">
          OAR registration
        </a>
        <a
          href="https://github.com/gwapupward-hub/oar/blob/main/docs/REGISTERING.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          Protocol documentation
        </a>
      </footer>
      <p className="footnote">
        A registered App ID is not a security audit or endorsement. Verification requires matching independent proofs.
      </p>
    </main>
  )
}
