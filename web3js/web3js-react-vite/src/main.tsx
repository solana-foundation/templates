import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@solana/wallet-adapter/styles.css";
import "./index.css";
import { Providers } from "./components/providers";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>
);
