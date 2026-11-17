/**
 * Worker entry point.
 * Serves the built static site (ASSETS binding, from ./dist) for every
 * normal page, and handles /api/guide itself for the live chatbot.
 */

import { handleGuideOptions, handleGuidePost, type GuideEnv } from "./guide";
import { handlePiVerifyPost, type PiAuthEnv } from "./pi-auth";
import { handlePiTransparencyGet } from "./pi-transparency";
import { handlePiTestnetRoot, handlePiTestnetGuideBlock } from "./pi-routing";
import { applyPiAppStudioHeaders, isPiEmbeddablePage } from "./pi-headers";

export interface Env extends GuideEnv, PiAuthEnv {
  ASSETS: { fetch(request: Request): Promise<Response> };
  PI_TESTNET_MODE?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const isPiTestnet = env.PI_TESTNET_MODE === "true";
    const testnetLanding = handlePiTestnetRoot(request, isPiTestnet);
    if (testnetLanding) return testnetLanding;
    const guideBlock = handlePiTestnetGuideBlock(request, isPiTestnet);
    if (guideBlock) return guideBlock;

    if (!isPiTestnet && url.pathname.startsWith("/api/pi/")) {
      return new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });
    }

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
    if (isPiEmbeddablePage(url, isPiTestnet, response.headers.get("Content-Type"))) {
      return applyPiAppStudioHeaders(response);
    }
    return response;
  },
};
