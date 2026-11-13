import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { handlePiTransparencyGet } from "./pi-transparency.ts";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

function env(allowed = true) {
  return {
    PI_AUTH_LIMITER: {
      limit: async () => ({ success: allowed }),
    },
  };
}

function request(method = "GET") {
  return new Request("https://pi-test.example/api/pi/transparency", {
    method,
    headers: { "CF-Connecting-IP": "203.0.113.7" },
  });
}

function word(value: bigint): string {
  return value.toString(16).padStart(64, "0");
}

function rpcResponse(data: string): Response {
  const result = data === "0xe20ccec3"
    ? `0x${"0".repeat(64)}${word(0n)}${word(0n)}${word(0n)}`
    : `0x${word(123n)}`;
  return Response.json({ jsonrpc: "2.0", id: 1, result });
}

test("returns an eight-read snapshot and decodes the pending withdrawal state", async () => {
  const urls: string[] = [];
  globalThis.fetch = async (input, init) => {
    urls.push(String(input));
    const payload = JSON.parse(String(init?.body)) as { params: [{ data: string }] };
    return rpcResponse(payload.params[0].data);
  };

  const response = await handlePiTransparencyGet(request(), env());
  const body = await response.json() as { status: string; totalSupply: { raw: string | null }; pendingWithdrawal: { exists: boolean | null } };

  assert.equal(response.status, 200);
  assert.equal(body.status, "ok");
  assert.equal(body.totalSupply.raw, "123");
  assert.equal(body.pendingWithdrawal.exists, false);
  assert.equal(urls.length, 8);
  assert.ok(urls.every((url) => url === "https://bsc-dataseed.bnbchain.org"));
});

test("falls back to the next public BNB RPC when the primary fails", async () => {
  const urls: string[] = [];
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    urls.push(url);
    if (url === "https://bsc-dataseed.bnbchain.org") return new Response("blocked", { status: 403 });
    const payload = JSON.parse(String(init?.body)) as { params: [{ data: string }] };
    return rpcResponse(payload.params[0].data);
  };

  const response = await handlePiTransparencyGet(request(), env());
  assert.equal(response.status, 200);
  assert.equal(urls.length, 16);
  assert.ok(urls.includes("https://bsc-dataseed-public.bnbchain.org"));
});

test("returns 429 without contacting RPC when rate limited", async () => {
  globalThis.fetch = async () => {
    throw new Error("RPC should not be called");
  };

  const response = await handlePiTransparencyGet(request(), env(false));
  assert.equal(response.status, 429);
});

test("fails closed when the rate-limit binding is missing or errors", async () => {
  const noBinding = await handlePiTransparencyGet(request(), {});
  const brokenBinding = await handlePiTransparencyGet(request(), {
    PI_AUTH_LIMITER: { limit: async () => { throw new Error("binding unavailable"); } },
  });

  assert.equal(noBinding.status, 503);
  assert.equal(brokenBinding.status, 503);
});

test("returns a clear 502 when every configured public RPC is unavailable", async () => {
  globalThis.fetch = async () => new Response("unavailable", { status: 503 });

  const response = await handlePiTransparencyGet(request(), env());
  const body = await response.json() as { error: string };
  assert.equal(response.status, 502);
  assert.match(body.error, /BNB Smart Chain RPC endpoints/);
});

test("rejects non-GET calls", async () => {
  const response = await handlePiTransparencyGet(request("POST"), env());
  assert.equal(response.status, 405);
});
