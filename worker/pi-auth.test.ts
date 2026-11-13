import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { handlePiVerifyPost } from "./pi-auth.ts";

const originalFetch = globalThis.fetch;
const validToken = "pi-test-access-token-123456789";

afterEach(() => {
  globalThis.fetch = originalFetch;
});

function makeRequest(body: unknown = { accessToken: validToken }, headers: Record<string, string> = {}): Request {
  return new Request("https://pi-test.example/api/pi/verify", {
    method: "POST",
    headers: {
      Origin: "https://pi-test.example",
      "Content-Type": "application/json",
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function env(success = true) {
  return {
    PI_AUTH_LIMITER: {
      limit: async () => ({ success }),
    },
  };
}

test("rejects cross-origin requests before contacting Pi", async () => {
  globalThis.fetch = async () => {
    throw new Error("fetch should not run");
  };
  const response = await handlePiVerifyPost(
    makeRequest({ accessToken: validToken }, { Origin: "https://attacker.example" }),
    env(),
  );
  assert.equal(response.status, 403);
});

test("rejects requests without JSON content type", async () => {
  const response = await handlePiVerifyPost(
    makeRequest({ accessToken: validToken }, { "Content-Type": "text/plain" }),
    env(),
  );
  assert.equal(response.status, 415);
});

test("rejects absent Origin and JSON null safely", async () => {
  const absentOrigin = await handlePiVerifyPost(
    makeRequest({ accessToken: validToken }, { Origin: "" }),
    env(),
  );
  const nullBody = await handlePiVerifyPost(makeRequest("null"), env());
  assert.equal(absentOrigin.status, 403);
  assert.equal(nullBody.status, 400);
});

test("uses Pi /v2/me as the source of truth and returns only verified identity", async () => {
  let requestedUrl = "";
  let authorization = "";
  globalThis.fetch = async (input, init) => {
    requestedUrl = String(input);
    authorization = new Headers(init?.headers).get("Authorization") ?? "";
    return new Response(JSON.stringify({ uid: "pi-uid-verified", username: "verified-user" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  const response = await handlePiVerifyPost(makeRequest({
    accessToken: validToken,
    user: { uid: "spoofed", username: "attacker" },
  }), env());
  const body = await response.json() as { user: { uid: string; username: string }; accessToken?: string };
  assert.equal(response.status, 200);
  assert.equal(requestedUrl, "https://api.minepi.com/v2/me");
  assert.equal(authorization, `Bearer ${validToken}`);
  assert.deepEqual(body, { user: { uid: "pi-uid-verified", username: "verified-user" } });
  assert.equal(JSON.stringify(body).includes(validToken), false);
});

test("maps expired Pi access tokens to 401 without exposing upstream content", async () => {
  globalThis.fetch = async () => new Response("private upstream detail", { status: 401 });
  const response = await handlePiVerifyPost(makeRequest(), env());
  assert.equal(response.status, 401);
  assert.equal((await response.text()).includes("private upstream"), false);
});

test("fails closed when the Cloudflare rate limiter denies the request", async () => {
  globalThis.fetch = async () => {
    throw new Error("fetch should not run");
  };
  const response = await handlePiVerifyPost(makeRequest(), env(false));
  assert.equal(response.status, 429);
});

test("fails closed if a rate limit binding is missing", async () => {
  const response = await handlePiVerifyPost(makeRequest(), {});
  assert.equal(response.status, 503);
});

test("rejects malformed tokens and oversized requests", async () => {
  const invalid = await handlePiVerifyPost(makeRequest({ accessToken: "too-short" }), env());
  const oversized = await handlePiVerifyPost(makeRequest("x".repeat(5_000)), env());
  assert.equal(invalid.status, 400);
  assert.equal(oversized.status, 413);
});

test("does not reflect Pi network failures or access tokens", async () => {
  globalThis.fetch = async () => {
    throw new Error(`upstream failed with ${validToken}`);
  };
  const response = await handlePiVerifyPost(makeRequest(), env());
  const text = await response.text();
  assert.equal(response.status, 502);
  assert.equal(text.includes(validToken), false);
  assert.equal(text.includes("upstream failed"), false);
});
