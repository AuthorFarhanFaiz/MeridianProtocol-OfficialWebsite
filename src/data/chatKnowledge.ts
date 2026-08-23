/**
 * Meridian Guide — official offline knowledge base.
 * Answers must stay factual, present-tense for live items,
 * and clearly labeled for planned / pending items.
 * No price, yield, listing, or return promises.
 */

export type ChatEntry = {
  id: string;
  patterns: string[];
  answer: string;
};

export const BOT_NAME = "Meridian Guide";
export const BOT_TAGLINE = "Official help · Public facts only";
export const DAILY_AI_LIMIT = 8; // per-day live-AI calls per visitor IP (local knowledge-base answers stay unlimited for everyone); the owner-unlock code is NOT stored here — see functions/api/guide.ts and the OWNER_UNLOCK_CODE Cloudflare secret

export const CHAT_SYSTEM_PROMPT = `
You are Meridian Guide, the official on-site assistant for Meridian Protocol (MRDN).
Use only public project facts. Never promise price, yield, listing, or returns.
Never ask for or accept seed phrases or private keys.
Refuse exploits, hacks, abuse, and harmful requests with a short warning.
If unsure, direct users to meridianprotocol.site documentation.
`.trim();

export const SAFETY_BLOCK_PATTERNS = [
  "seed phrase",
  "seedphrase",
  "private key",
  "privatekey",
  "mnemonic",
  "secret key",
  "recovery phrase",
  "how to hack",
  "exploit the",
  "drain the",
  "rug",
  "phishing",
  "sql injection",
  "xss attack",
  "delete all data",
  "drop table",
  "give me admin",
];

export const CHAT_KNOWLEDGE: ChatEntry[] = [
  // ── Identity ──────────────────────────────────────────
  {
    id: "greeting",
    patterns: ["hi", "hello", "hey", "gm", "good morning", "good evening", "salam", "assalam"],
    answer:
      "Hello — I’m Meridian Guide, the official on-site assistant for Meridian Protocol (MRDN). Ask about the token, contracts, staking, docs, roadmap, or security status. I only share public, verifiable facts.",
  },
  {
    id: "who-are-you",
    patterns: ["who are you", "what are you", "are you a bot", "assistant", "guide"],
    answer:
      "I’m Meridian Guide — the official help assistant on meridianprotocol.site. I answer from public project documentation and on-chain facts. I’m not a human admin and I will never ask for your seed phrase or private key.",
  },
  {
    id: "what-is-meridian",
    patterns: ["what is meridian", "what is the project", "about meridian", "tell me about meridian", "project overview"],
    answer:
      "Meridian Protocol is a transparency-first Web3 project built around MRDN, a fixed-supply BEP-20 token on BNB Smart Chain. The focus is verifiable infrastructure and honest status labeling — what is live vs what is still planned. Website: meridianprotocol.site",
  },
  {
    id: "what-is-mrdn",
    patterns: ["what is mrdn", "mrdn token", "about mrdn", "token name"],
    answer:
      "MRDN is the token of Meridian Protocol: a fixed-supply BEP-20 asset on BNB Smart Chain (Chain ID 56). Total supply is 1,000,000,000. There is no mint function on the token contract. Always verify the address on the Official Links page before interacting.",
  },

  // ── Token facts ───────────────────────────────────────
  {
    id: "supply",
    patterns: ["total supply", "supply", "how many tokens", "max supply", "fixed supply"],
    answer:
      "Total supply is 1,000,000,000 MRDN (one billion), fixed at deployment. No mint function exists on the token contract. Circulating supply is not yet defined because public distribution and liquidity have not been fully rolled out.",
  },
  {
    id: "decimals",
    patterns: ["decimals", "decimal"],
    answer:
      "MRDN uses 18 decimals — standard for BEP-20 tokens on BNB Smart Chain.",
  },
  {
    id: "chain",
    patterns: ["which chain", "what network", "bnb", "bsc", "binance smart chain", "chain id"],
    answer:
      "MRDN is deployed on BNB Smart Chain Mainnet (Chain ID 56), as a BEP-20 token. Being on BSC does not mean Binance or BNB Chain has endorsed or invested in the project.",
  },
  {
    id: "contract-address",
    patterns: ["contract address", "token address", "ca", "contract", "token contract"],
    answer:
      "Official MRDN token contract: 0xd4025a390a0b2a606f24Ea33A902D10D978715F2 — source-verified on BscScan. Always cross-check this exact address on meridianprotocol.site/official-links before any transaction.",
  },
  {
    id: "verified",
    patterns: ["verified", "source code", "bscscan verified"],
    answer:
      "Yes — the MRDN token contract source code is verified on BscScan. Verification means the published source matches the deployed bytecode. It is not the same thing as a professional security audit.",
  },
  {
    id: "mint-owner",
    patterns: ["mint", "owner", "admin", "pause", "blacklist", "can you mint"],
    answer:
      "On the MRDN token contract: no owner address, no mint function, no pause function, and no blacklist function. That is a factual description of the deployed token — not a claim that the wider system is risk-free.",
  },

  // ── Supporting contracts ──────────────────────────────
  {
    id: "staking-live",
    patterns: ["staking", "stake", "can i stake", "staking contract", "how to stake"],
    answer:
      "Staking is live. MeridianStaking is deployed and source-verified on BSC Mainnet at 0xE4679e407A4967f7182E87C1bc25Dcc786c3D3eb. You can stake MRDN, claim rewards, and unstake principal with no lock period. Rewards only pay while the reward pool is funded and a rate is set — there is no guaranteed APY.",
  },
  {
    id: "staking-apy",
    patterns: ["apy", "apr", "reward rate", "how much reward", "interest"],
    answer:
      "Meridian does not promise a fixed or guaranteed APY. Staking rewards depend on the on-chain reward pool balance and the active reward rate set in the contract. Check the pool on BscScan before relying on any projected return.",
  },
  {
    id: "vesting",
    patterns: ["vesting", "team tokens", "founder allocation", "team allocation", "cliff"],
    answer:
      "Founder/Team allocation is 18% (180,000,000 MRDN), locked in MeridianVesting: 0xCb89849805B44A9D8Ee11B5D40cd6962d4fF93f7. Schedule: 10-month (300-day) cliff, then 3-year linear release. The vesting contract is immutable — no admin function to unlock early.",
  },
  {
    id: "treasury",
    patterns: ["treasury", "timelock", "treasury contract"],
    answer:
      "Treasury allocation is 15% (150,000,000 MRDN), held in a timelock at 0x921B238633241e14606217b9bFa2e2dE0Db67033. Withdrawals require a minimum 3-day (72-hour / 259,200 seconds) delay. It is single-key controlled with a public delay — not a multisig.",
  },
  {
    id: "all-contracts",
    patterns: ["all contracts", "list contracts", "smart contracts", "infrastructure"],
    answer:
      "Live verified contracts: (1) MRDN Token 0xd4025a390a0b2a606f24Ea33A902D10D978715F2 (2) Staking 0xE4679e407A4967f7182E87C1bc25Dcc786c3D3eb (3) Vesting 0xCb89849805B44A9D8Ee11B5D40cd6962d4fF93f7 (4) Treasury Timelock 0x921B238633241e14606217b9bFa2e2dE0Db67033 — all listed on Official Links.",
  },

  // ── Tokenomics ────────────────────────────────────────
  {
    id: "tokenomics",
    patterns: ["tokenomics", "allocation", "distribution", "percent"],
    answer:
      "Allocation percentages are finalized: Founder/Team 18% (vesting live), Treasury 15% (timelock live), Community & Ecosystem 40%, Liquidity 15%, Marketing 7%, Strategic Reserve 5%. Some distribution mechanisms are still being deployed progressively. Full detail: /tokenomics and the whitepaper.",
  },
  {
    id: "circulating",
    patterns: ["circulating", "circulating supply", "how much circulating"],
    answer:
      "Circulating supply is not yet defined as a single public trading figure. Public distribution and liquidity have not been fully launched. About 33% of supply (team vesting + treasury) is held in contracts without instant-access admin control.",
  },

  // ── Security ──────────────────────────────────────────
  {
    id: "audit",
    patterns: ["audit", "audited", "security audit", "manual audit"],
    answer:
      "An independent professional manual security audit has not been completed yet. Do not treat MRDN or related contracts as fully audited. Automated SolidityScan scores exist (token ~95.57, staking ~90.77) — those are tools, not a substitute for a named auditor’s report. See /security",
  },
  {
    id: "solidityscan",
    patterns: ["solidityscan", "automated scan", "scan score"],
    answer:
      "Automated SolidityScan results (publicly discussed by the project): MRDN token score about 95.57/100 with 0 Critical and 0 High; staking about 90.77/100 with 0 Critical and 0 High. Automated scans help, but they are not a manual audit.",
  },
  {
    id: "is-it-safe",
    patterns: ["is it safe", "safe", "secure", "can i trust"],
    answer:
      "No smart contract system is risk-free. Source is verified; automated scans were run; manual audit is still pending. Never invest more than you can afford to lose. Read the Risk Disclosure. Meridian will never ask for your seed phrase.",
  },
  {
    id: "seed-phrase",
    patterns: ["seed", "private key", "wallet password", "secret phrase"],
    answer:
      "⚠️ Meridian Protocol will never request your seed phrase, private key, or wallet password. Anyone who asks for them is not official. Only use links from meridianprotocol.site/official-links",
  },

  // ── Market / liquidity ────────────────────────────────
  {
    id: "where-buy",
    patterns: ["where to buy", "how to buy", "buy mrdn", "purchase", "pancake"],
    answer:
      "There is no public trading liquidity deployed yet and no exchange listing claimed. Buying on a DEX is not available as an official live market at this time. Any future liquidity will be announced only after it is actually live and documented.",
  },
  {
    id: "price",
    patterns: ["price", "chart", "market cap", "fdv", "how much is mrdn"],
    answer:
      "Meridian does not provide price targets or market promises. There is no guaranteed value. Until public liquidity exists, there is no official public market price to quote from the project.",
  },
  {
    id: "listing",
    patterns: ["listing", "cex", "binance listing", "exchange"],
    answer:
      "No exchange listing is claimed. Any future listing would be announced only if and when it actually happens through official channels — never as a guarantee.",
  },
  {
    id: "liquidity-plan",
    patterns: ["liquidity", "when liquidity", "lp lock"],
    answer:
      "Liquidity is planned after security and readiness work (Phase 3 on the roadmap), not before. The project’s stated sequencing prefers audit/readiness before deploying and locking liquidity with public proof.",
  },

  // ── Roadmap / status ──────────────────────────────────
  {
    id: "roadmap",
    patterns: ["roadmap", "phases", "timeline", "plan"],
    answer:
      "Roadmap (status-labeled): Phase 1 Foundation — COMPLETED. Phase 2 Security & documentation — IN PROGRESS. Phase 3 Liquidity & market infrastructure — PLANNED. Phase 4 Ecosystem — PLANNED. Phase 5 Expansion — FUTURE. Details: /roadmap",
  },
  {
    id: "launch",
    patterns: ["when launch", "launch date", "official launch", "going live"],
    answer:
      "Core token and supporting contracts are already deployed. “Official market launch” (public liquidity) is still planned and not marked complete. The project does not publish guaranteed launch dates for liquidity or listings.",
  },
  {
    id: "status",
    patterns: ["status", "current status", "project status", "stage"],
    answer:
      "Current stage: development / infrastructure live. Token, staking, vesting, and treasury timelock are live and verified. Manual audit and public liquidity are not complete. Label: Token deployed · Infrastructure live · Product in active development.",
  },

  // ── Docs / legal ──────────────────────────────────────
  {
    id: "whitepaper",
    patterns: ["whitepaper", "white paper"],
    answer:
      "The official Whitepaper is available on the site (Documentation → Whitepaper). It covers token specification, architecture, tokenomics, security status, risks, and more. Read it together with the Risk Disclosure.",
  },
  {
    id: "litepaper",
    patterns: ["litepaper", "lite paper"],
    answer:
      "The Litepaper is a shorter official summary of the same facts. Find it under Documentation → Litepaper on meridianprotocol.site",
  },
  {
    id: "risk",
    patterns: ["risk", "risks", "risk disclosure", "disclaimer"],
    answer:
      "Key risks include market risk, liquidity risk, smart-contract risk (manual audit pending), regulatory risk, and team continuity risk. Full text: Risk Disclosure on the site. Nothing on this site is financial advice.",
  },
  {
    id: "legal",
    patterns: ["legal", "terms", "privacy", "cookie policy", "compliance"],
    answer:
      "Legal pages (Terms, Privacy, Cookie Policy, Risk Disclosure, etc.) are published on the site. Some items remain draft pending external legal counsel review when budget allows. Crypto rules vary by jurisdiction — you must follow your local laws.",
  },

  // ── Utility / governance ──────────────────────────────
  {
    id: "utility",
    patterns: ["utility", "use case", "what can i use", "purpose"],
    answer:
      "Today: transferable BEP-20 token + live staking. Community structure and broader ecosystem utility are in development or planned. Lightweight governance is exploratory/future — not a live full DAO. Capacity matches a small independent team.",
  },
  {
    id: "governance",
    patterns: ["governance", "dao", "voting", "vote"],
    answer:
      "No full on-chain DAO is live today. Governance participation is listed as a future exploratory direction, not a committed shipped feature with a fixed date.",
  },

  // ── Team / contact ────────────────────────────────────
  {
    id: "founder",
    patterns: ["founder", "who founded", "farhan", "team", "who is behind"],
    answer:
      "Founder: Farhan Faiz. Meridian is developed by a small independent team. The site does not invent large anonymous “team” profiles — only verifiable public association.",
  },
  {
    id: "contact",
    patterns: ["contact", "email", "support", "how to contact"],
    answer:
      "Official email: admin@meridianprotocol.site — listed on the website. Prefer this for serious proposals. Meridian will not DM you first asking for funds or keys.",
  },
  {
    id: "socials",
    patterns: ["telegram", "discord", "twitter", "x.com", "social", "community", "official links"],
    answer:
      "Official channels only: Website meridianprotocol.site · X @Meridian_MRDN · Telegram t.me/MeridianProtocolMRDN · Discord (link on site) · GitHub MeridianProtocol-Official. Full registry: /official-links",
  },
  {
    id: "github",
    patterns: ["github", "open source", "code repo"],
    answer:
      "Official GitHub organization: github.com/MeridianProtocol-Official — use the link from Official Links to avoid fake repos.",
  },

  // ── How to verify ─────────────────────────────────────
  {
    id: "verify",
    patterns: ["how to verify", "verify yourself", "independent", "don't trust"],
    answer:
      "Open the token on BscScan, confirm Contract Source Code Verified, check totalSupply, and confirm there is no mint/pause/blacklist on the token. Cross-check every address on /official-links. Prefer on-chain evidence over screenshots.",
  },
  {
    id: "dashboard",
    patterns: ["dashboard", "connect wallet", "balances"],
    answer:
      "The site Dashboard is read-only: it can show public on-chain data and, if you connect a wallet, your own public balances. It does not take custody, does not trade for you, and never needs your seed phrase.",
  },

  // ── Partnerships / promo ──────────────────────────────
  {
    id: "partnership",
    patterns: ["partnership", "collaborate", "ama", "marketing", "promotion", "kol"],
    answer:
      "Serious proposals can be sent in writing to admin@meridianprotocol.site with deliverables, structure, and public proof links. The project prioritizes transparency and infrastructure over paid hype. No guaranteed investors or buyers from any campaign.",
  },
  {
    id: "investment",
    patterns: ["invest", "investment", "funding", "investor", "raise"],
    answer:
      "This assistant does not solicit investments. MRDN is not presented as a guaranteed return product. For capital or strategic discussions, use a written proposal to admin@meridianprotocol.site and rely only on public docs and on-chain facts.",
  },

  // ── Scams / safety ops ────────────────────────────────
  {
    id: "scam",
    patterns: ["scam", "fake", "impersonat", "dm me", "airdrop link"],
    answer:
      "Scammers often impersonate projects. Meridian will never DM first asking you to connect a wallet, pay a fee, or share a seed phrase. Use only links from /official-links. If unsure, don’t click.",
  },
  {
    id: "airdrop",
    patterns: ["airdrop", "free tokens", "giveaway official"],
    answer:
      "Only believe airdrops or giveaways announced on official Meridian channels and the website. Random DMs offering free MRDN are typically scams. When a real campaign exists, rules will be published publicly first.",
  },

  // ── Meta / limits ─────────────────────────────────────
  {
    id: "financial-advice",
    patterns: ["financial advice", "should i buy", "should i sell", "advice"],
    answer:
      "Nothing here is financial, investment, tax, or legal advice. Do your own research and consult licensed professionals if needed. Crypto assets can go to zero.",
  },
  {
    id: "binance-endorsement",
    patterns: ["binance partner", "backed by binance", "official binance"],
    answer:
      "Deployment on BNB Smart Chain does not mean Binance or the BNB Chain organization has invested in, approved, or endorsed Meridian Protocol.",
  },
  {
    id: "thanks",
    patterns: ["thank you", "thanks", "thx", "shukriya"],
    answer:
      "You’re welcome. For full detail, use Documentation, Security, and Official Links on meridianprotocol.site. Stay safe — never share your keys.",
  },
  {
    id: "help",
    patterns: ["help", "what can you do", "commands", "menu"],
    answer:
      "You can ask me about: MRDN token facts, contract addresses, staking, vesting, treasury, tokenomics, audit status, roadmap, docs, risks, and official links. I answer from public information only.",
  },
];

export const FALLBACK_ANSWER =
  "I don’t have a specific entry for that in the official knowledge base. Please check Documentation, FAQ, Security, or Official Links on meridianprotocol.site — or email admin@meridianprotocol.site for serious inquiries.";
      
