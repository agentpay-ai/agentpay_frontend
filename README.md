# AgentPay AI — Frontend

> Next.js web app for the [AgentPay AI](https://agentpayai.online/) platform — pay-per-use AI powered by on-chain USDT payments on BotChain.

**Live Site:** agentpayai.online  
**Backend API:** https://agentpay-backend-eight.vercel.app  
**GitHub Org:** https://github.com/agentpay-ai

---

## What it does

AgentPay AI is a web app that lets users:

- Connect their wallet (MetaMask / MiniPay / WalletConnect via Privy)
- Chat with Claude AI, generate images, and get code completions
- Pay per request in USDT on BotChain — no subscription, no account needed
- Optionally deposit USDT once to get a prepaid session token for frictionless multi-request usage
- View balance and session status in real time

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Wallet**: Privy + wagmi + viem
- **Payments**: x402 client + USDT transfer on BotChain
- **AI Backend**: [agentpay_backend](https://github.com/agentpay-ai/agentpay_backend) Express API
- **Deployment**: Vercel

---

## Local Development

```bash
git clone https://github.com/agentpay-ai/agentpay_frontend
cd agentpay_frontend
npm install
cp .env.production.example .env.local   # fill in your values
npm run dev                             # starts on http://localhost:3000
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL (default: `https://agentpay-backend-eight.vercel.app`) |
| `NEXT_PUBLIC_PRIVY_APP_ID` | Privy app ID for wallet login |
| `NEXT_PUBLIC_ENVIRONMENT` | `development` or `production` |

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing / home |
| `/chat` | Claude AI chat (payment-gated) |
| `/code` | Code generation (payment-gated) |
| `/image` | Image generation (payment-gated) |
| `/history` | Request history |

---

## Related

- **Backend repo**: [agentpay-ai/agentpay_backend](https://github.com/agentpay-ai/agentpay_backend)
- **Live API**: https://agentpay-backend-eight.vercel.app/health
