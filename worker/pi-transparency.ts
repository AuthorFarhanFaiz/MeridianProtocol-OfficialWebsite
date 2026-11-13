import { CONTRACTS } from "../src/data/token.ts";
import type { PiAuthEnv } from "./pi-auth";

const BSC_RPC_ENDPOINTS = [
  "https://bsc-dataseed.bnbchain.org",
  "https://bsc-dataseed-public.bnbchain.org",
  "https://bsc-dataseed.nariox.org",
];
const WORD_BYTES = 64;

export type RpcRead = { raw: string | null; error?: string };

export type TransparencySnapshot = {
  fetchedAt: string;
  status: "ok" | "partial";
  totalSupply: RpcRead;
  totalStaked: RpcRead;
  rewardPool: RpcRead;
  vestingAllocation: RpcRead;
  vestingReleased: RpcRead;
  treasuryBalance: RpcRead;
  treasuryMinDelay: RpcRead;
  pendingWithdrawal: {
    exists: boolean | null;
    to: string | null;
    amount: string | null;
    executableAfter: string | null;
    error?: string;
  };
};

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

async function ethCall(address: string, data: string): Promise<string> {
  let lastError: unknown;

  for (const endpoint of BSC_RPC_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_call",
          params: [{ to: address, data }, "latest"],
          id: 1,
        }),
        redirect: "error",
        signal: AbortSignal.timeout(6_000),
      });

      if (!response.ok) {
        lastError = new Error(`RPC returned HTTP ${response.status}`);
        continue;
      }

      const payload = (await response.json()) as { result?: unknown; error?: unknown };
      if (payload.error || typeof payload.result !== "string" || !/^0x[0-9a-f]+$/i.test(payload.result)) {
        lastError = new Error("RPC returned an invalid contract response");
        continue;
      }
      return payload.result;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("BNB Smart Chain RPC unavailable");
}

function firstWord(encoded: string): string {
  const word = encoded.slice(2, 2 + WORD_BYTES);
  if (word.length !== WORD_BYTES) throw new Error("Unexpected contract response");
  return BigInt(`0x${word}`).toString();
}

async function readValue(address: string, selector: string): Promise<RpcRead> {
  try {
    return { raw: firstWord(await ethCall(address, selector)) };
  } catch {
    return { raw: null, error: "Contract read failed on available BNB RPC endpoints" };
  }
}

async function readPendingWithdrawal(): Promise<TransparencySnapshot["pendingWithdrawal"]> {
  try {
    const encoded = await ethCall(CONTRACTS.treasury.address, "0xe20ccec3");
    const words = encoded.slice(2).match(new RegExp(`.{${WORD_BYTES}}`, "g")) ?? [];
    if (words.length < 4) throw new Error("Unexpected contract response");

    const [recipientWord, amountWord, executableWord, existsWord] = words;
    if (!recipientWord || !amountWord || !executableWord || !existsWord) {
      throw new Error("Unexpected contract response");
    }

    return {
      exists: BigInt(`0x${existsWord}`) !== 0n,
      to: `0x${recipientWord.slice(-40)}`,
      amount: BigInt(`0x${amountWord}`).toString(),
      executableAfter: BigInt(`0x${executableWord}`).toString(),
    };
  } catch {
    return {
      exists: null,
      to: null,
      amount: null,
      executableAfter: null,
      error: "Treasury contract read failed on available BNB RPC endpoints",
    };
  }
}

export async function handlePiTransparencyGet(request: Request, env: PiAuthEnv): Promise<Response> {
  if (request.method !== "GET") return json({ error: "Method not allowed" }, 405);

  // Transparency data is public and read-only. Enforce the Cloudflare limit
  // when this deployment has the optional binding, but don't make the public
  // dashboard unavailable solely because a Testnet-only binding is absent.
  if (env.PI_AUTH_LIMITER) {
    const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
    try {
      const allowed = await env.PI_AUTH_LIMITER.limit({ key: `pi-data:${ip}` });
      if (!allowed.success) return json({ error: "Too many BNB data refreshes. Wait a minute and try again." }, 429);
    } catch {
      return json({ error: "BNB data service is temporarily unavailable" }, 503);
    }
  }

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

  const snapshot: TransparencySnapshot = {
    fetchedAt: new Date().toISOString(),
    status: "ok",
    totalSupply,
    totalStaked,
    rewardPool,
    vestingAllocation,
    vestingReleased,
    treasuryBalance,
    treasuryMinDelay,
    pendingWithdrawal,
  };

  const values = [totalSupply, totalStaked, rewardPool, vestingAllocation, vestingReleased, treasuryBalance, treasuryMinDelay];
  const availableReads = values.filter((value) => value.raw !== null).length + Number(pendingWithdrawal.exists !== null);
  if (availableReads === 0) {
    return json({ error: "BNB Smart Chain RPC endpoints could not read the Meridian contracts. Please retry shortly." }, 502);
  }
  if (availableReads < 8) snapshot.status = "partial";

  return json(snapshot, 200);
}
