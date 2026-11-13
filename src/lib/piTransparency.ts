import { CONTRACTS, TOKEN_CONFIG } from "@/data/token";

const BSC_RPC = "https://bsc-dataseed.bnbchain.org";
const WORD_BYTES = 64;
const UNIT = 10n ** BigInt(TOKEN_CONFIG.decimals);

export type ReadValue = {
  raw: string | null;
  error?: string;
};

export type PiTransparencySnapshot = {
  fetchedAt: string;
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

async function ethCall(address: string, data: string): Promise<string> {
  const response = await fetch(BSC_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "eth_call",
      params: [{ to: address, data }, "latest"],
      id: 1,
    }),
    signal: AbortSignal.timeout(12_000),
  });

  if (!response.ok) throw new Error("BNB Smart Chain RPC unavailable.");
  const result = (await response.json()) as {
    result?: unknown;
    error?: { message?: string };
  };
  if (result.error || typeof result.result !== "string" || !/^0x[0-9a-f]*$/i.test(result.result)) {
    throw new Error("Contract read unavailable.");
  }
  return result.result;
}

function firstWord(encoded: string): string {
  const word = encoded.slice(2, 2 + WORD_BYTES);
  if (word.length !== WORD_BYTES) throw new Error("Unexpected contract response.");
  return BigInt(`0x${word}`).toString();
}

async function readValue(address: string, selector: string): Promise<ReadValue> {
  try {
    return { raw: firstWord(await ethCall(address, selector)) };
  } catch {
    return { raw: null, error: "Live read currently unavailable" };
  }
}

async function readPendingWithdrawal(): Promise<PiTransparencySnapshot["pendingWithdrawal"]> {
  try {
    const encoded = await ethCall(CONTRACTS.treasury.address, "0xe20ccec3");
    const words = encoded.slice(2).match(new RegExp(`.{${WORD_BYTES}}`, "g")) ?? [];
    if (words.length < 4) throw new Error("Unexpected contract response.");
    const [recipientWord, amountWord, executableWord, existsWord] = words;
    if (!recipientWord || !amountWord || !executableWord || !existsWord) {
      throw new Error("Unexpected contract response.");
    }
    return {
      exists: BigInt(`0x${existsWord}`) !== 0n,
      to: `0x${recipientWord.slice(-40)}`,
      amount: BigInt(`0x${amountWord}`).toString(),
      executableAfter: BigInt(`0x${executableWord}`).toString(),
    };
  } catch {
    return { exists: null, to: null, amount: null, executableAfter: null, error: "Live read currently unavailable" };
  }
}

export async function fetchPiTransparency(): Promise<PiTransparencySnapshot> {
  const [totalSupply, totalStaked, rewardPool, vestingAllocation, vestingReleased, treasuryBalance, treasuryMinDelay, pendingWithdrawal] = await Promise.all([
    readValue(CONTRACTS.token.address, "0x18160ddd"),
    readValue(CONTRACTS.staking.address, "0x817b1cd2"),
    readValue(CONTRACTS.staking.address, "0x7a5c08ae"),
    readValue(CONTRACTS.vesting.address, "0x79203dc4"),
    readValue(CONTRACTS.vesting.address, "0xe33b7de3"),
    readValue(CONTRACTS.treasury.address, "0x313dab20"),
    readValue(CONTRACTS.treasury.address, "0xc63c4e9b"),
    readPendingWithdrawal(),
  ]);

  return {
    fetchedAt: new Date().toISOString(),
    totalSupply,
    totalStaked,
    rewardPool,
    vestingAllocation,
    vestingReleased,
    treasuryBalance,
    treasuryMinDelay,
    pendingWithdrawal,
  };
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
