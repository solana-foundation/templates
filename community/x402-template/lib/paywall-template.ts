/**
 * Solana x402 Paywall HTML Template
 *
 * This template provides a beautiful UI for users to connect their Phantom wallet
 * and pay with USDC to access protected content using the x402 protocol.
 */

export const solanaPaywallHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Required - Solana</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #14F195 0%, #9945FF 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .paywall-container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 480px;
            width: 100%;
            padding: 48px;
            text-align: center;
        }
        .solana-logo {
            width: 80px;
            height: 80px;
            margin: 0 auto 24px;
            background: linear-gradient(135deg, #14F195 0%, #9945FF 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
        }
        h1 {
            font-size: 32px;
            color: #1a1a1a;
            margin-bottom: 12px;
            font-weight: 700;
        }
        .description {
            font-size: 16px;
            color: #666;
            margin-bottom: 32px;
            line-height: 1.6;
        }
        .price-box {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 24px;
            border: 2px solid #14F195;
        }
        .price-label {
            font-size: 14px;
            color: #666;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .price-amount {
            font-size: 48px;
            font-weight: 800;
            background: linear-gradient(135deg, #14F195 0%, #9945FF 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .price-network {
            font-size: 13px;
            color: #999;
            margin-top: 8px;
        }
        .status-message {
            padding: 14px;
            border-radius: 10px;
            margin-bottom: 20px;
            font-size: 14px;
            display: none;
            animation: slideIn 0.3s ease;
        }
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .status-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .status-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .status-info {
            background: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
        }
        button {
            width: 100%;
            padding: 18px;
            font-size: 17px;
            font-weight: 700;
            color: white;
            background: linear-gradient(135deg, #14F195 0%, #9945FF 100%);
            border: none;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(153, 69, 255, 0.3);
        }
        button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(153, 69, 255, 0.4);
        }
        button:active:not(:disabled) {
            transform: translateY(0);
        }
        button:disabled {
            background: linear-gradient(135deg, #ccc 0%, #999 100%);
            cursor: not-allowed;
            box-shadow: none;
        }
        .network-info {
            margin-top: 32px;
            padding-top: 24px;
            border-top: 2px solid #f0f0f0;
            font-size: 13px;
            color: #999;
        }
        .wallet-address {
            background: #f8f9fa;
            padding: 12px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            margin-bottom: 16px;
            word-break: break-all;
            color: #495057;
        }
        .hidden {
            display: none;
        }
        .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #9945FF;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
            display: inline-block;
            margin-right: 8px;
            vertical-align: middle;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="paywall-container">
        <div class="solana-logo">◎</div>

        <h1>Payment Required</h1>

        <p class="description">
            Connect your Solana wallet and pay with USDC to access this protected content
        </p>

        <div class="price-box">
            <div class="price-label">Price</div>
            <div class="price-amount">$0.01</div>
            <div class="price-network">USDC on Solana Devnet</div>
        </div>

        <div id="walletAddress" class="wallet-address hidden"></div>
        <div id="statusMessage" class="status-message"></div>

        <button id="actionButton" onclick="handleAction()">
            Connect Phantom Wallet
        </button>

        <div class="network-info">
            <div style="font-weight: 600; color: #666;">Network: Solana Devnet</div>
            <div style="margin-top: 6px;">Powered by Custom x402 Solana Protocol</div>
        </div>
    </div>

    <script src="https://unpkg.com/@solana/web3.js@latest/lib/index.iife.min.js"></script>

    <script>
        const USDC_DEVNET_MINT = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU';
        const TREASURY_ADDRESS = 'CmGgLQL36Y9ubtTsy2zmE46TAxwCBm66onZmPPhUWNqv';
        const RPC_ENDPOINT = 'https://api.devnet.solana.com';
        const PAYMENT_AMOUNT_USD = 0.01;
        const USDC_DECIMALS = 6;

        const TOKEN_PROGRAM_ID = new solanaWeb3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

        function getAssociatedTokenAddress(mint, owner) {
          const ASSOCIATED_TOKEN_PROGRAM_ID = new solanaWeb3.PublicKey(
            'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
          );

          const [address] = solanaWeb3.PublicKey.findProgramAddressSync(
            [
              owner.toBuffer(),
              TOKEN_PROGRAM_ID.toBuffer(),
              mint.toBuffer(),
            ],
            ASSOCIATED_TOKEN_PROGRAM_ID
          );
          return address;
        }

        function createTransferCheckedInstruction(source, mint, destination, owner, amount, decimals) {
          const keys = [
            { pubkey: source, isSigner: false, isWritable: true },
            { pubkey: mint, isSigner: false, isWritable: false },
            { pubkey: destination, isSigner: false, isWritable: true },
            { pubkey: owner, isSigner: true, isWritable: false },
          ];

          const data = new Uint8Array(9 + 8);
          data[0] = 12;

          const amountBigInt = BigInt(amount);
          for (let i = 0; i < 8; i++) {
            data[1 + i] = Number((amountBigInt >> BigInt(i * 8)) & BigInt(0xff));
          }

          data[9] = decimals;

          return new solanaWeb3.TransactionInstruction({
            keys,
            programId: TOKEN_PROGRAM_ID,
            data,
          });
        }

        let walletAddress = null;
        let walletProvider = null;

        function showStatus(message, type) {
          const statusEl = document.getElementById('statusMessage');
          statusEl.textContent = message;
          statusEl.className = 'status-message status-' + type;
          statusEl.style.display = 'block';

          if (type === 'error') {
            console.error(message);
          }
        }

        function updateButton(text, disabled = false) {
          const btn = document.getElementById('actionButton');
          btn.innerHTML = disabled ? '<span class="spinner"></span>' + text : text;
          btn.disabled = disabled;
        }

        function displayWalletAddress(address) {
          const walletEl = document.getElementById('walletAddress');
          walletEl.textContent = '✓ Connected: ' + address.slice(0, 4) + '...' + address.slice(-4);
          walletEl.classList.remove('hidden');
        }

        function getPhantomProvider() {
          if ('phantom' in window) {
            const provider = window.phantom?.solana;
            if (provider?.isPhantom) {
              return provider;
            }
          }
          return null;
        }

        async function connectWallet() {
          try {
            walletProvider = getPhantomProvider();

            if (!walletProvider) {
              showStatus('Phantom wallet not found. Please install it.', 'error');
              setTimeout(() => {
                window.open('https://phantom.app/', '_blank');
              }, 2000);
              return false;
            }

            showStatus('Connecting to Phantom...', 'info');

            const response = await walletProvider.connect();
            walletAddress = response.publicKey.toString();

            displayWalletAddress(walletAddress);
            showStatus('Wallet connected successfully!', 'success');
            updateButton('Pay $0.01 USDC');

            return true;

          } catch (error) {
            console.error('Connection error:', error);
            showStatus('Failed to connect wallet: ' + error.message, 'error');
            return false;
          }
        }

        async function makePayment() {
          if (!walletAddress || !walletProvider) {
            showStatus('Please connect your wallet first', 'error');
            return;
          }

          updateButton('Processing Payment...', true);
          showStatus('Creating transaction...', 'info');

          try {
            const connection = new solanaWeb3.Connection(RPC_ENDPOINT, 'confirmed');

            const senderPubkey = new solanaWeb3.PublicKey(walletAddress);
            const treasuryPubkey = new solanaWeb3.PublicKey(TREASURY_ADDRESS);
            const usdcMint = new solanaWeb3.PublicKey(USDC_DEVNET_MINT);

            const usdcAmount = Math.floor(PAYMENT_AMOUNT_USD * Math.pow(10, USDC_DECIMALS));

            showStatus('Finding token accounts...', 'info');

            const senderTokenAccount = getAssociatedTokenAddress(
              usdcMint,
              senderPubkey
            );

            const treasuryTokenAccount = getAssociatedTokenAddress(
              usdcMint,
              treasuryPubkey
            );

            showStatus('Building transaction...', 'info');

            const transaction = new solanaWeb3.Transaction();
            transaction.feePayer = senderPubkey;

            const transferInstruction = createTransferCheckedInstruction(
              senderTokenAccount,
              usdcMint,
              treasuryTokenAccount,
              senderPubkey,
              usdcAmount,
              USDC_DECIMALS
            );

            transaction.add(transferInstruction);

            const { blockhash } = await connection.getLatestBlockhash('confirmed');
            transaction.recentBlockhash = blockhash;

            showStatus('Please approve the transaction in Phantom...', 'info');

            let signature;
            try {
              const { signature: txSignature } = await walletProvider.signAndSendTransaction(transaction);
              signature = txSignature;
            } catch (sendError) {
              if (sendError.message && sendError.message.includes('signAndSendTransaction')) {
                const signedTransaction = await walletProvider.signTransaction(transaction);
                signature = await connection.sendRawTransaction(signedTransaction.serialize());
              } else {
                throw sendError;
              }
            }

            console.log('✅ Transaction sent! Signature:', signature);
            console.log('View on Solana Explorer:', 'https://explorer.solana.com/tx/' + signature + '?cluster=devnet');

            showStatus('Confirming transaction...', 'info');

            const confirmResult = await connection.confirmTransaction(signature, 'finalized');

            if (confirmResult.value.err) {
              console.error('Transaction failed:', confirmResult.value.err);
              throw new Error('Transaction failed on-chain: ' + JSON.stringify(confirmResult.value.err));
            }

            console.log('✅ Transaction finalized successfully!');
            console.log('Signature:', signature);

            await new Promise(resolve => setTimeout(resolve, 2000));

            const paymentData = {
              x402Version: 1,
              scheme: 'exact',
              network: 'solana-devnet',
              payload: {
                signature: signature,
                from: walletAddress,
                to: TREASURY_ADDRESS,
                amount: usdcAmount.toString(),
                token: USDC_DEVNET_MINT,
              }
            };
            const paymentHeader = JSON.stringify(paymentData);

            console.log('💳 Sending x402 payment header:', paymentData);

            showStatus('Verifying payment with server...', 'info');

            const response = await fetch(window.location.href, {
              method: 'GET',
              headers: {
                'X-PAYMENT': paymentHeader,
              },
            });

            if (response.ok) {
              showStatus('Payment successful! Redirecting...', 'success');
              updateButton('Success! Redirecting...');

              setTimeout(() => {
                window.location.reload();
              }, 1500);
            } else {
              const errorText = await response.text();
              console.error('❌ Payment verification failed!');
              console.error('Response Status:', response.status);
              console.error('Response Body:', errorText);

              throw new Error('Payment verification failed. Check console for details.');
            }

          } catch (error) {
            console.error('Payment error:', error);

            let errorMessage = 'Payment failed: ' + error.message;

            if (error.message && error.message.includes('already been processed')) {
              errorMessage = 'Transaction was already sent. Please manually refresh the page.';
            } else if (error.message && (error.message.includes('0x1') || error.message.includes('insufficient'))) {
              errorMessage = 'Insufficient USDC balance. Get devnet USDC at: https://faucet.circle.com/';
            } else if (error.message && (error.message.includes('User rejected') || error.message.includes('cancelled'))) {
              errorMessage = 'Transaction cancelled by user.';
            } else if (error.message && error.message.includes('Payment verification failed')) {
              errorMessage = 'Payment was sent but verification failed. Check console for details, then manually refresh to see if it worked.';
            }

            showStatus(errorMessage, 'error');
            updateButton('Retry Payment');
          }
        }

        async function handleAction() {
          if (!walletAddress) {
            await connectWallet();
          } else {
            await makePayment();
          }
        }

        window.addEventListener('load', async () => {
          const provider = getPhantomProvider();
          if (provider) {
            try {
              const resp = await provider.connect({ onlyIfTrusted: true });
              walletAddress = resp.publicKey.toString();
              walletProvider = provider;
              displayWalletAddress(walletAddress);
              updateButton('Pay $0.01 USDC');
            } catch (e) {
              // Wallet not already connected
            }
          }
        });
    </script>
</body>
</html>
`
