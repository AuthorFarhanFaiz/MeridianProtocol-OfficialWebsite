/**
 * Worker entry point.
 * Serves the built static site (ASSETS binding, from ./dist) for every
 * normal page, and handles /api/guide itself for the live chatbot.
 */

import { handleGuideOptions, handleGuidePost, type GuideEnv } from "./guide";

export interface Env extends GuideEnv {
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

    return env.ASSETS.fetch(request);
  },
};
