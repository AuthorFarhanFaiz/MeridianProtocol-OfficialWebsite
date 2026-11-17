import assert from "node:assert/strict";
import { test } from "node:test";
import { applyPiAppStudioHeaders, isPiEmbeddablePage } from "./pi-headers.ts";

test("Pi Testnet /pi HTML allows only same-origin and the exact Pi App Studio origin", async () => {
  assert.equal(isPiEmbeddablePage(new URL("https://testnet.meridianprotocol.site/pi"), true, "text/html"), true);
  const response = applyPiAppStudioHeaders(new Response("<!doctype html><html></html>", {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Security-Policy": "default-src 'self'; frame-ancestors 'none'",
      "X-Frame-Options": "DENY",
      "Cross-Origin-Resource-Policy": "same-origin",
    },
  }));
  const csp = response.headers.get("Content-Security-Policy") ?? "";

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("X-Frame-Options"), null);
  assert.equal(response.headers.get("Cross-Origin-Resource-Policy"), "cross-origin");
  assert.equal(response.headers.get("Cross-Origin-Opener-Policy"), "same-origin-allow-popups");
  assert.match(csp, /frame-ancestors 'self' https:\/\/appstudio\.pinet\.com/);
  assert.doesNotMatch(csp, /piappengine\.com/);
  assert.doesNotMatch(csp, /frame-ancestors[^;]*\*/);
  assert.match(csp, /script-src 'self' https:\/\/sdk\.minepi\.com/);
  assert.match(csp, /connect-src 'self' https:\/\/socialchain\.app https:\/\/api\.minepi\.com/);
});

test("only Pi Testnet /pi HTML routes receive the embedding policy", () => {
  assert.equal(isPiEmbeddablePage(new URL("https://testnet.meridianprotocol.site/pi/"), true, "text/html"), true);
  assert.equal(isPiEmbeddablePage(new URL("https://testnet.meridianprotocol.site/pi/privacy"), true, "text/html"), false);
  assert.equal(isPiEmbeddablePage(new URL("https://meridianprotocol.site/pi"), false, "text/html"), false);
  assert.equal(isPiEmbeddablePage(new URL("https://testnet.meridianprotocol.site/pi"), true, "application/json"), false);

  const legalPage = new Response("<html></html>", {
    headers: { "X-Frame-Options": "DENY", "Content-Security-Policy": "frame-ancestors 'none'" },
  });
  assert.equal(legalPage.headers.get("X-Frame-Options"), "DENY");
  assert.match(legalPage.headers.get("Content-Security-Policy") ?? "", /frame-ancestors 'none'/);
});
