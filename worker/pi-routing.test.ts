import assert from "node:assert/strict";
import { test } from "node:test";
import { handlePiTestnetGuideBlock, handlePiTestnetRoot } from "./pi-routing.ts";

test("redirects the Testnet app root to Pi and preserves query parameters", () => {
  const response = handlePiTestnetRoot(new Request("https://testnet.meridianprotocol.site/?source=portal"), true);
  assert.ok(response);
  assert.equal(response.status, 302);
  assert.equal(response.headers.get("Location"), "https://testnet.meridianprotocol.site/pi?source=portal");
  assert.equal(response.headers.get("Cache-Control"), "no-store");
});

test("leaves production and non-root Testnet URLs untouched", () => {
  assert.equal(handlePiTestnetRoot(new Request("https://meridianprotocol.site/"), true), null);
  assert.equal(handlePiTestnetRoot(new Request("https://testnet.meridianprotocol.site/pi"), true), null);
  assert.equal(handlePiTestnetRoot(new Request("https://testnet.meridianprotocol.site/"), false), null);
});

test("disables the unrelated Guide API only on the Pi Testnet host", async () => {
  const blocked = handlePiTestnetGuideBlock(new Request("https://testnet.meridianprotocol.site/api/guide", { method: "POST" }), true);
  assert.ok(blocked);
  assert.equal(blocked.status, 404);
  assert.match(await blocked.text(), /not available in the Pi Testnet experience/);
  assert.equal(handlePiTestnetGuideBlock(new Request("https://meridianprotocol.site/api/guide", { method: "POST" }), true), null);
  assert.equal(handlePiTestnetGuideBlock(new Request("https://testnet.meridianprotocol.site/api/guide", { method: "POST" }), false), null);
});
