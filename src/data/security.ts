export interface SecurityItem {
  id: string;
  status: string;
  title: string;
  description: string;
}

export const SECURITY_ITEMS: SecurityItem[] = [
  {
    id: "source-verification",
    status: "VERIFIED",
    title: "Token Contract — Source Verification",
    description:
      "Deployed bytecode matches published source, confirmed on BscScan. This confirms what code is running — it is not a security audit.",
  },
  {
    id: "solidityscan-token",
    status: "COMPLETED",
    title: "Automated Scan — MRDN Token (SolidityScan)",
    description:
      "SolidityScan score: 95.57/100 — 0 Critical, 0 High, 2 Low, 8 Informational findings. This is an automated static-analysis tool, not a substitute for an independent manual audit.",
  },
  {
    id: "solidityscan-staking",
    status: "COMPLETED",
    title: "Automated Scan — Staking Contract (SolidityScan)",
    description:
      "SolidityScan score: 90.77/100 — 0 Critical, 0 High, 1 Medium, 4 Low, 24 Informational findings. This is an automated static-analysis tool, not a substitute for an independent manual audit.",
  },
  {
    id: "vesting-verification",
    status: "VERIFIED",
    title: "Founder/Team Vesting Contract",
    description:
      "18% of total supply (180,000,000 MRDN) is locked in a fully immutable vesting contract — 10-month cliff + 3-year linear release. No admin function exists. Verified and funded on BSC Mainnet.",
  },
  {
    id: "treasury-verification",
    status: "VERIFIED",
    title: "Treasury Timelock Contract",
    description:
      "15% of total supply (150,000,000 MRDN) is held in MeridianTreasuryTimelock (0x921B238633241e14606217b9bFa2e2dE0Db67033). Minimum delay of 3 days before sensitive actions. Verified on BscScan.",
  },
  {
    id: "audit",
    status: "NOT YET COMPLETED",
    title: "Independent Manual Security Audit",
    description:
      "No third-party professional manual audit has been commissioned yet. Do not treat any Meridian contract as audited until a named auditor’s report is linked here.",
  },
  {
    id: "legal-review",
    status: "PLANNED",
    title: "Legal & Securities Review",
    description:
      "Professional legal review of the token structure and documentation language has not yet been obtained in any jurisdiction.",
  },
];

export const CONTRACT_ADMIN_SURFACE =
  "Per the deployed and verified source: the MRDN token has no owner address, no mint function, no pause function, and no blacklist function. The staking contract owner can only manage the reward rate and fund the reward pool. Vesting is fully immutable. Treasury is protected by a 3-day timelock.";

export const SEED_PHRASE_WARNING =
  "Meridian Protocol will never request your seed phrase, private key, or wallet password. No official channel will ever ask for this information under any circumstance.";
