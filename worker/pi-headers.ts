// Pi App Studio's official host. Keep this exact; never broaden the framing
// policy to an arbitrary Pi subdomain.
const PI_APP_STUDIO_FRAME_ANCESTORS = [
  "https://appstudio.pinet.com",
];

export function isPiEmbeddablePage(url: URL, isPiTestnet: boolean, contentType: string | null): boolean {
  return isPiTestnet
    && (url.pathname === "/pi" || url.pathname === "/pi/")
    && (contentType?.includes("text/html") ?? false);
}

export function applyPiAppStudioHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.delete("X-Frame-Options");
  headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "form-action 'self'",
      "script-src 'self' https://sdk.minepi.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob:",
      "connect-src 'self' https://socialchain.app https://api.minepi.com",
      `frame-ancestors 'self' ${PI_APP_STUDIO_FRAME_ANCESTORS.join(" ")}`,
      "upgrade-insecure-requests",
    ].join("; "),
  );
  // The CSP above is the precise framing allowlist. CORP must not contradict it.
  headers.set("Cross-Origin-Resource-Policy", "cross-origin");
  headers.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
