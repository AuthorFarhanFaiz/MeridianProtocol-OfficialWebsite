import { TOKEN_CONFIG } from "@/data/token";

const UNIT = 10n ** BigInt(TOKEN_CONFIG.decimals);

export type ReadValue = {
  raw: string | null;
  error?: string;
};

export type PiTransparencySnapshot = {
  fetchedAt: string;
  status: "ok" | "partial";
  totalSupply: ReadValue;
  totalStaked: ReadValue;
  rewardPool: ReadValue;
  vestingAllocation: ReadValue;
  vestingReleased: ReadValue;
  treasuryBalance: ReadValue;
  treasuryMinDelay: ReadValue;
  pendingWithdrawal: {
    exists: boolean | null;
    to: string | null;
    amount: string | null;
    executableAfter: string | null;
    error?: string;
  };
};

export async function fetchPiTransparency(): Promise<PiTransparencySnapshot> {
  const response = await fetch("/api/pi/transparency", {
    method: "GET",
    credentials: "same-origin",
    cache: "no-store",
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(30_000),
  });

  const result = (await response.json()) as PiTransparencySnapshot | { error?: string };
  if (!response.ok || !("fetchedAt" in result)) {
    const message = "error" in result ? result.error : undefined;
    if (response.status === 429) throw new Error("Too many refreshes. Wait a minute, then try again.");
    throw new Error(message ?? "Live BNB contract data is temporarily unavailable. Please refresh shortly.");
  }

  return result;
}

export function formatMrdn(raw: string | null): string {
  if (raw === null) return "Unavailable";
  const value = BigInt(raw);
  const whole = value / UNIT;
  const fraction = (value % UNIT) * 100n / UNIT;
  const decimal = fraction === 0n ? "" : `.${fraction.toString().padStart(2, "0").replace(/0+$/, "")}`;
  return `${whole.toLocaleString()}${decimal} MRDN`;
}

export function formatDuration(raw: string | null): string {
  if (raw === null) return "Unavailable";
  const seconds = BigInt(raw);
  const days = seconds / 86_400n;
  const hours = (seconds % 86_400n) / 3_600n;
  return `${days.toString()} days${hours > 0n ? `, ${hours.toString()} hours` : ""}`;
}
