export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "What is Meridian Protocol?",
    a: "Meridian Protocol is a transparency-first project built around MRDN, a fixed-supply BEP-20 token on BNB Smart Chain. The token and core infrastructure (staking, vesting, treasury timelock) are live and source-verified. Broader product utility continues to be developed and is labeled by real status.",
  },
  {
    q: "What is the total supply of MRDN?",
    a: "1,000,000,000 MRDN. Supply is fixed at deployment. There is no mint function on the token contract.",
  },
  {
    q: "Where can I verify the contracts?",
    a: "Only use the Official Links Registry on meridianprotocol.site. Token, staking, vesting, and treasury timelock addresses are listed there with BscScan links. Do not trust addresses sent in DMs.",
  },
  {
    q: "Is staking live?",
    a: "Yes. The staking contract is verified on BscScan. There is no mandatory lock period for principal. Rewards depend on the reward pool being funded — Meridian does not promise a fixed or guaranteed APY.",
  },
  {
    q: "Has Meridian been audited?",
    a: "Source code is verified on BscScan and automated scans have been run. An independent professional manual security audit has not been completed yet. That status is shown clearly on the Security page.",
  },
  {
    q: "Is there public liquidity / can I trade MRDN?",
    a: "Public trading liquidity has not been deployed as of this writing. Any future liquidity will be disclosed clearly. There is no guaranteed listing or market.",
  },
  {
    q: "Does Meridian guarantee price, yield, or returns?",
    a: "No. There is no guaranteed price, yield, listing, or return. See the Risk Disclosure before interacting with any contract.",
  },
  {
    q: "Will Meridian ever ask for my seed phrase?",
    a: "Never. Official channels will never ask for your seed phrase, private key, or wallet password. We will never DM you first requesting funds or keys.",
  },
  {
    q: "Who controls the treasury?",
    a: "Treasury allocation is held in a verified timelock contract with a 3-day minimum delay. Details are on the Tokenomics and Official Links pages.",
  },
  {
    q: "How do I contact the project?",
    a: "Use the official email and channels listed on the Official Links page and Contact page only. Ignore lookalike accounts.",
  },
];
