export type AllocationStatus =
  | "Confirmed"
  | "Locked"
  | "Vesting"
  | "Planned"
  | "TBD"
  | "Live";

export interface AllocationCategory {
  id: string;
  name: string;
  status: AllocationStatus;
  percent?: string;
  tokens?: string;
  note?: string;
}

export const ALLOCATION_CATEGORIES: AllocationCategory[] = [
  {
    id: "team",
    name: "Founder / Team",
    status: "Vesting",
    percent: "18%",
    tokens: "180,000,000",
    note:
      "Live and funded — MeridianVesting (0xCb89849805B44A9D8Ee11B5D40cd6962d4fF93f7). 10-month cliff + 3-year linear release. Fully immutable.",
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
    status: "Live",
    percent: "15%",
    tokens: "150,000,000",
    note:
      "Live and funded — MeridianTreasuryTimelock (0x921B238633241e14606217b9bFa2e2dE0Db67033). 3-day minimum delay.",
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
  "Total supply is fixed and verifiable on-chain. Circulating supply remains undefined until public distribution and liquidity deployment occur. The Founder/Team allocation is locked under an immutable vesting schedule. The Treasury allocation is secured in a live timelock contract.";
