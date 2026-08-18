export type AllocationStatus =
  | "Confirmed"
  | "Locked"
  | "Vesting"
  | "Planned"
  | "TBD";

export interface AllocationCategory {
  id: string;
  name: string;
  status: AllocationStatus;
  percent?: string;
  tokens?: string;
  note?: string;
}

// Allocation percentages were finalized following industry-standard
// research (team allocations typically 15-25%, community 40%+). On-chain
// distribution mechanisms are being deployed progressively — each
// category's status reflects exactly what is live today, not what is
// merely planned.
export const ALLOCATION_CATEGORIES: AllocationCategory[] = [
  {
    id: "team",
    name: "Founder / Team",
    status: "Vesting",
    percent: "18%",
    tokens: "180,000,000",
    note:
      "Live and funded on BSC Mainnet — MeridianVesting contract (0xCb89849805B44A9D8Ee11B5D40cd6962d4fF93f7). 10-month cliff, then 3-year linear release. Fully immutable, no admin function of any kind.",
  },
  {
    id: "community",
    name: "Community & Ecosystem",
    status: "Confirmed",
    percent: "40%",
    tokens: "400,000,000",
    note: "Allocation finalized. Distribution mechanism: Planned.",
  },
  {
    id: "liquidity",
    name: "Liquidity",
    status: "Confirmed",
    percent: "15%",
    tokens: "150,000,000",
    note: "Allocation finalized. Held until DEX liquidity is actually funded.",
  },
  {
    id: "treasury",
    name: "Treasury",
    status: "Confirmed",
    percent: "15%",
    tokens: "150,000,000",
    note: "Allocation finalized. Recommended custody: multisig (not yet established).",
  },
  {
    id: "marketing",
    name: "Marketing",
    status: "Confirmed",
    percent: "7%",
    tokens: "70,000,000",
    note: "Allocation finalized. Distribution: need-based, Planned.",
  },
  {
    id: "reserve",
    name: "Strategic Reserve",
    status: "Confirmed",
    percent: "5%",
    tokens: "50,000,000",
    note: "Allocation finalized. Long-term hold, no current distribution plan.",
  },
];

export const TOKENOMICS_NOTE =
  "Total supply is a fact about the contract. Circulating supply depends on which wallets are actually distributed and unlocked. The Founder/Team allocation is 0% liquid at any point — it is entirely subject to the MeridianVesting schedule. The remaining 82% stays in its current holding pattern until each category's own distribution mechanism goes live.";
