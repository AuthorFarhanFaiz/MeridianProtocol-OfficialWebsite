# Meridian Protocol — Website

Production website for Meridian Protocol (MRDN), a fixed-supply BEP-20 token on BNB Smart Chain. Built with React, TypeScript, Vite, and Tailwind CSS — served by a Cloudflare Worker with static assets and a live AI-powered on-site guide (**MeridianGuide**).

**Live at:** https://meridianprotocol.site

## Project status

The token contract is deployed and verified. The rest of the ecosystem — independent audit, tokenomics allocation, liquidity, utility — is in active development. See `/roadmap` and `/security` for the current, honest status of each.

## Tech stack

- React 18 + TypeScript (strict mode)
- Vite
- Tailwind CSS
- React Router
- Framer Motion (used sparingly)
- **Cloudflare Worker** (static assets + a custom Worker script) — deployed via `npx wrangler deploy`, not Cloudflare Pages
- **MeridianGuide** — on-site AI assistant: answers common questions instantly and for free from a built-in knowledge base, and calls a live AI model (via OpenRouter, free tier) through the Worker's `/api/guide` route for anything outside that knowledge base

## Project structure

```
src/
  components/   Shared UI (Header, Footer, Button, StatusBadge, MeridianGuide chat widget, ...)
  data/         Centralized facts — token config, roadmap, tokenomics, legal text, chatbot knowledge base
  layouts/      Root layout (header/footer wrapper)
  pages/        One file per route
  styles/       Global Tailwind entry point
worker/
  index.ts      Worker entry point — serves the built static site and routes /api/guide
  guide.ts      MeridianGuide backend logic (OpenRouter call, per-IP rate limiting, owner unlock)
public/
  documents/    Whitepaper / litepaper PDFs
  favicon/      Icon assets
```

All project facts (contract address, supply, social links, roadmap status) are centralized in `src/data/`. Never hardcode these values inside a component — import them from the relevant data file instead.

## Development

```
pnpm install
pnpm dev
```

## Build

```
pnpm build      # runs typecheck + Vite build, outputs to dist/
pnpm preview    # preview the production build locally
```

## Deployment

Deployment target is a **Cloudflare Worker with static assets** (configured in `wrangler.jsonc`), connected directly to this GitHub repository via Cloudflare's own Build & Deploy integration — pushing to `main` triggers a build and deploy automatically. No GitHub Actions workflow is used for deployment.

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Static assets are served from `./dist`; `worker/index.ts` handles everything else, including the `/api/guide` chatbot route

**Runtime secrets** (Cloudflare dashboard → this Worker → Settings → *Runtime* variables and secrets — not the build-time ones):

| Secret | Purpose |
|---|---|
| `OPENROUTER_API_KEY` | Powers MeridianGuide's live AI answers (OpenRouter, free tier) |
| `OWNER_UNLOCK_CODE` | Private code that removes the daily live-AI limit for the site owner, typed in the chat as `/unlock <code>` |

**KV binding:** `GUIDE_KV` (Workers KV namespace) — used to rate-limit live-AI calls per visitor IP. If unbound, the chatbot still works but the limit isn't enforced.

`pnpm audit` runs in CI on every push to catch known vulnerable dependencies.

## Website security hardening

This is a static site plus one small serverless API route — no database, no login form, no user accounts. What's implemented and what you still need to do:

**Already implemented in this repo:**

- Security headers via Cloudflare
- No secrets in the codebase; `.env` is gitignored, `.env.example` has placeholders only — real secrets live only as Cloudflare Runtime secrets
- `pnpm audit` runs in CI on every push
- Contact page uses a plain `mailto:` link — no contact-form backend to attack
- MeridianGuide's `/api/guide` route: input length limits, a safety filter that blocks seed-phrase/private-key/exploit requests, and per-IP rate limiting on the live-AI path

**You need to do this yourself (account-level, can't be done in code):**

- Enable 2FA on your GitHub account and your Cloudflare account
- In GitHub repo settings → Branches, add a branch protection rule on `main` requiring CI to pass before merge
- In Cloudflare → your domain → Security, turn on Bot Fight Mode and Always Use HTTPS
- Rotate `OPENROUTER_API_KEY` or `OWNER_UNLOCK_CODE` immediately if either is ever exposed anywhere (logs, screenshots, etc.)

## Security

Never commit `.env`, private keys, seed phrases, or API tokens. Copy `.env.example` to `.env` for local values — only public, non-secret values belong in `VITE_*` variables, since anything with that prefix is bundled into the client-side build. See `SECURITY.md` for the vulnerability disclosure process.

## Contributing

See `CONTRIBUTING.md`.

## Official links

- Website: https://meridianprotocol.site
- X: https://x.com/Meridian_MRDN
- Telegram: https://t.me/MeridianProtocol
- Discord: https://meridianprotocol.site/community
- Contact: admin@meridianprotocol.site
- Pi Testnet validation asset: /pi/pi-app-validation.txt
