import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import apiRouter from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Home route - HTML
app.get("/", (req, res) => {
  res.type("html").send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>X402 Express Server</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/api">API</a>
          <a href="/healthz">Health</a>
        </nav>
        <h1>X402 Express Server and Client</h1>
        <p>This project demonstrates how to use X402 payment system with Express.js, allowing API endpoints to charge for access using Solana USDC payments.</p>
        
        <h2>What is X402?</h2>
        <p>X402 is a payment protocol that enables API endpoints to automatically charge clients for access. Payments are processed on the Solana blockchain using USDC.</p>
        
        <h2>Features</h2>
        <ul>
          <li><strong>Protected API Routes:</strong> Endpoints that require payment to access</li>
          <li><strong>Automatic Payment Processing:</strong> Clients automatically pay when calling protected endpoints</li>
          <li><strong>Solana Integration:</strong> Payments processed on Solana using USDC</li>
          <li><strong>Configurable Settings:</strong> Customize payment amounts, network, and payment address</li>
        </ul>
        
        <h2>Quick Start</h2>
        <p>Try the protected endpoint:</p>
        <ul>
          <li><a href="/api">API Base</a> - Check API status</li>
          <li><a href="/api/protected">Protected Endpoint</a> - Requires payment (100 USDC)</li>
        </ul>
        
        <h2>Usage</h2>
        <p>For detailed setup and usage instructions, see the <a href="/about">About</a> page or check the <a href="https://github.com/v1xingyue/x402-express" target="_blank">GitHub repository</a>.</p>
        
        <img src="/logo.png" alt="Logo" width="120" />
      </body>
    </html>
  `);
});

app.get("/about", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "components", "about.htm"));
});

// Example API endpoint - JSON
app.get("/api-data", (req, res) => {
  res.json({
    message: "Here is some sample API data",
    items: ["apple", "banana", "cherry"],
  });
});

// Health check
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", apiRouter);

export default app;
