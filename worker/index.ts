/**
 * Worker entry point.
 * Serves the built static site (ASSETS binding, from ./dist) for every
 * normal page, and handles /api/guide itself for the live chatbot.
 */

import { handleGuideOptions, handleGuidePost, type GuideEnv } from "./guide";
import { handlePiVerifyPost, type PiAuthEnv } from "./pi-auth";
import { handlePiTransparencyGet } from "./pi-transparency";

export interface Env extends GuideEnv, PiAuthEnv {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/guide") {
      if (request.method === "OPTIONS") return handleGuideOptions(request);
      if (request.method === "POST") return handleGuidePost(request, env);
      return new Response("Method not allowed", { status: 405 });
    }

    if (url.pathname === "/api/pi/verify") {
      return handlePiVerifyPost(request, env);
    }

    if (url.pathname === "/api/pi/transparency") {
      return handlePiTransparencyGet(request, env);
    }

    const response = await env.ASSETS.fetch(request);
    if ((url.pathname === "/pi" || url.pathname === "/pi/") && response.headers.get("Content-Type")?.includes("text/html")) {
      const headers = new Headers(response.headers);
      const csp = headers.get("Content-Security-Policy") ?? "default-src 'self'; script-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'";
      headers.set("Content-Security-Policy", extendPiPageCsp(csp));
      headers.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
      return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
    }
    return response;
  },
};

function extendPiPageCsp(csp: string): string {
  return csp
    .replace(/script-src ([^;]+)/, (_directive, sources: string) =>
      `script-src ${sources} https://sdk.minepi.com`,
    )
    .replace(/connect-src ([^;]+)/, (_directive, sources: string) =>
      `connect-src ${sources} https://api.minepi.com`,
    );
}
