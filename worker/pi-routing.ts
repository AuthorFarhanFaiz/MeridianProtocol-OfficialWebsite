const PI_TESTNET_HOST = "testnet.meridianprotocol.site";

export function handlePiTestnetRoot(request: Request, piTestnetMode: boolean): Response | null {
  const url = new URL(request.url);
  if (!piTestnetMode || url.hostname !== PI_TESTNET_HOST || url.pathname !== "/" || (request.method !== "GET" && request.method !== "HEAD")) {
    return null;
  }

  url.pathname = "/pi";
  return new Response(null, {
    status: 302,
    headers: { Location: url.toString(), "Cache-Control": "no-store" },
  });
}

export function handlePiTestnetGuideBlock(request: Request, piTestnetMode: boolean): Response | null {
  const url = new URL(request.url);
  if (!piTestnetMode || url.hostname !== PI_TESTNET_HOST || url.pathname !== "/api/guide") return null;

  return new Response(JSON.stringify({ error: "The Meridian Guide is not available in the Pi Testnet experience." }), {
    status: 404,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}
