# Meridian Protocol Pi Testnet integration

## Scope and safety

This is an additive `/pi` section in an isolated copy of the official website source. It keeps the existing BNB website and app routes, authentication, wallet connections, and contracts intact. Pi support is Testnet-only and read-only. No Pi or MRDN payments, transfers, sales, swaps, bridges, DNS changes, production variables, GitHub pushes, or production deployment were performed.

## Existing architecture found

- React 18, TypeScript, Vite, Tailwind CSS, and React Router 6.
- `src/App.tsx` defines the existing site routes; `RootLayout` supplies the shared header/footer.
- Cloudflare Worker entry is `worker/index.ts`, serving Vite output through the `ASSETS` binding and handling `/api/guide`.
- `wrangler.jsonc` is the existing production configuration. It was not changed.
- `public/_headers` applies a restrictive global CSP. Pi SDK/API/BSC read access is allowed only on `/pi` by the Worker response.
- `src/data/token.ts` is the contract facts source of truth. Its token, staking, vesting, and treasury addresses are used by the new section.
- Existing `/dashboard` reads supply, staking and vesting values. The Pi page independently reads the same public values plus treasury balance, minimum delay, and pending withdrawal state.
- No project test suite was present in the supplied website ZIP; a focused Worker authentication test suite was added.

## Files added or changed

- Changed `src/App.tsx`, `src/data/nav.ts`, `package.json`, and `worker/index.ts`.
- Added `src/pages/PiNetwork.tsx`, `src/lib/piSdk.ts`, and `src/lib/piTransparency.ts`.
- Added `worker/pi-auth.ts`, `worker/pi-auth.test.ts`, `worker/pi-transparency.ts`, and `worker/pi-transparency.test.ts`.
- Added `wrangler.pi-testnet.jsonc` as a separate Worker deployment configuration. It does not attach a custom domain and enables only `workers.dev`.
- Added this report.

## Pi SDK and verification

- Loads the official SDK only when `/pi` is visited.
- Initializes SDK v2.0 with `sandbox: true` and requests only the `username` scope.
- Sends the transient access token to same-origin `POST /api/pi/verify`; it is not saved in localStorage, cookies, or logs.
- The Worker checks same-origin requests, JSON content type, body/token size, and a per-IP Cloudflare rate limit. It calls `GET https://api.minepi.com/v2/me` using the user's bearer token and returns only the server-verified Pi UID and username.
- No Pi Server API Key is needed for the documented `/v2/me` access-token verification flow. No API key or private secret is included in the frontend.
- The page's logout button clears the currently displayed identity. There is no durable Meridian Pi session or Pi permission revocation flow in this integration; permission revocation is handled through Pi's own settings.
- Pi reports an incomplete payment only as a notice. This integration does not process, approve, or complete payments.

## Transparency data

The `/pi` page requests a same-origin `GET /api/pi/transparency` from the Cloudflare Worker. The Worker makes read-only `eth_call` requests against the existing token, staking, vesting, and treasury contracts, with three public BNB RPC endpoints tried in order. This keeps RPC access out of the mobile browser's cross-origin path. It applies the Testnet Worker rate-limit binding and returns per-field unavailable states when only some reads fail; if all reads fail, it returns an explicit service error. The page displays a retryable error instead of silently rendering all fields as unavailable. The API response is not cached. It also links to each BscScan record. No trusted transaction indexer exists in this ZIP, so transaction history opens the public BscScan record instead of showing a fabricated feed.

## Required setup before a Testnet deployment

1. In the Pi Developer Portal, open the existing Testnet app `meridian-protocol-a8tp` inside Pi Browser and configure the development/test URL according to the Portal's current Testnet workflow. The Portal's Development URL was previously reported as unconfigured, so Pi sign-in has not been live-tested.
2. Build the site, then deploy only with `wrangler.pi-testnet.jsonc`, not the existing production configuration. From this repository root the intended commands are `pnpm build` followed by `npx wrangler deploy --config wrangler.pi-testnet.jsonc`. The new config targets the separate `meridianprotocol-pi-testnet` Worker with `workers.dev`; it does not configure DNS.
3. Before first deploy, confirm the `PI_AUTH_LIMITER` `namespace_id` in `wrangler.pi-testnet.jsonc` is unused in the Cloudflare account; replace it with a unique positive integer if needed. Its threshold is 15 checks per minute per IP, subject to Cloudflare's documented per-location approximation.
4. Use the resulting separate `workers.dev` URL in the Pi Testnet app configuration only after checking the Portal's URL field requirements. Do not point the production app at this Worker.
5. Test sign-in inside Pi Browser/Sandbox and confirm that the Worker returns a verified username. This repository's local tests cannot prove the real Pi Developer Portal configuration or Pi Browser session.

No `PI_API_KEY` secret is required for this read-only authentication verification endpoint. Do not add or expose a wallet private key.

## Tests and remaining limitations

The added mocked tests cover origin/content-type checks, request-size validation, Pi rate limiting, verified identity sourcing, expired tokens, upstream failures, BNB RPC fallback, BNB rate limiting, partial response parsing, and total RPC failure. They stub external requests and do not contact Pi or BNB mainnet. Use Node 22.8+ to run `pnpm test:pi`.

The Pi Developer Portal development URL must be configured by the project owner. Live Pi authentication, live BNB RPC reads, domain/hosting approval, and deployment remain unverified. The focused `pnpm test:pi` suite passed (15/15) with Pi and BNB requests mocked; frontend and Worker TypeScript checks passed, and the changed Pi files pass focused lint. Full project lint reports 12 pre-existing violations in `src/pages/Dashboard.tsx` and `src/pages/Token.tsx`. The production build reaches Vite but is blocked because this local environment forbids esbuild child-process spawning (`spawn EPERM`), so a successful production build is not claimed.

## Official references

- Pi SDK reference: https://developers.minepi.com/docs/api-reference/SdkReference
- Pi authentication guide: https://developers.minepi.com/docs/authenticate-user/Authentication
- Pi Platform API (`/v2/me`): https://developers.minepi.com/docs/api-reference/PlatformAPI
- Pi app registration and Testnet: https://developers.minepi.com/docs/build-first-app/RegisterApp
- Cloudflare Worker rate limits: https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
- Cloudflare static asset headers: https://developers.cloudflare.com/workers/static-assets/headers/
