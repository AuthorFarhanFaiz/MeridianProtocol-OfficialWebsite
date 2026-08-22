// Single source of truth for all token facts referenced across the site.
// Update values here only — never hardcode the contract address, supply,
// or links inside individual components.

export const TOKEN_CONFIG = {
  name: "Meridian Protocol",
  symbol: "MRDN",
  chain: "BNB Smart Chain",
  chainId: 56,
  standard: "BEP-20",
  decimals: 18,
  contractAddress: "0xd4025a390a0b2a606f24Ea33A902D10D978715F2",
  totalSupply: "1,000,000,000",
  totalSupplyRaw: 1_000_000_000,
  circulatingSupply: "Not yet defined",
  explorerUrl:
    "https://bscscan.com/token/0xd4025a390a0b2a606f24Ea33A902D10D978715F2",
  contractVerified: true,
  auditStatus: "pending" as const, // "pending" | "in-progress" | "completed"
  hasMintFunction: false,
  hasOwner: false,
  hasPause: false,
  hasBlacklist: false,
} as const;

export const CONTRACTS = {
  token: {
    name: "MRDN Token",
    address: "0xd4025a390a0b2a606f24Ea33A902D10D978715F2",
    explorer: "https://bscscan.com/address/0xd4025a390a0b2a606f24Ea33A902D10D978715F2",
    verified: true,
    status: "Live",
  },
  staking: {
    name: "Meridian Staking",
    address: "0xE4679e407A4967f7182E87C1bc25Dcc786c3D3eb",
    explorer: "https://bscscan.com/address/0xE4679e407A4967f7182E87C1bc25Dcc786c3D3eb",
    verified: true,
    status: "Live",
  },
  vesting: {
    name: "Founder / Team Vesting",
    address: "0xCb89849805B44A9D8Ee11B5D40cd6962d4fF93f7",
    explorer: "https://bscscan.com/address/0xCb89849805B44A9D8Ee11B5D40cd6962d4fF93f7",
    verified: true,
    status: "Live",
    allocation: "180,000,000 MRDN (18%)",
    schedule: "10-month cliff + 3-year linear",
  },
  treasury: {
    name: "Treasury Timelock",
    address: "0x921B238633241e14606217b9bFa2e2dE0Db67033",
    explorer: "https://bscscan.com/address/0x921B238633241e14606217b9bFa2e2dE0Db67033",
    verified: true,
    status: "Live",
    allocation: "150,000,000 MRDN (15%)",
    minDelay: "3 days (72 hours / 259200 seconds)",
  },
} as const;

export const SITE_CONFIG = {
  domain: "meridianprotocol.site",
  url: "https://meridianprotocol.site",
  contactEmail: "admin@meridianprotocol.site",
  githubUrl: "https://github.com/MeridianProtocol-Official",
  twitterUrl: "https://x.com/Meridian_MRDN",
  twitterHandle: "@Meridian_MRDN",
  discordUrl: "https://discord.gg/ymBr23ppCq",
  telegramUrl: "https://t.me/MeridianProtocolMRDN",
  linkedinUrl: "https://www.linkedin.com/in/farhan-faiz-meridian",
} as const;

export const PROJECT_STATUS = {
  // Keep this in sync with reality. Do not mark LIVE unless the product
  // functionality described is actually shipped.
  stage: "DEVELOPMENT" as
    | "PRE-LAUNCH"
    | "DEVELOPMENT"
    | "LIVE"
    | "COMING SOON",
  label: "Token deployed · Infrastructure live · Product in active development",
} as const;

export const DOCUMENTS = {
  whitepaper: {
    href: "/documents/meridian-whitepaper.pdf",
    pages: 26,
    updated: "2026",
  },
  litepaper: {
    href: "/documents/meridian-litepaper.pdf",
    pages: 14,
    updated: "2026",
  },
} as const;
