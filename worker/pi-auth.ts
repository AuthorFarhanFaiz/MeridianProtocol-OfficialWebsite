const PI_ME_ENDPOINT = "https://api.minepi.com/v2/me";
const MAX_BODY_BYTES = 4_096;
const MAX_ACCESS_TOKEN_LENGTH = 4_096;

export interface RateLimitBinding {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

export interface PiAuthEnv {
  PI_AUTH_LIMITER?: RateLimitBinding;
}

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

async function readBodyWithinLimit(request: Request): Promise<string> {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("empty");

  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new Error("too-large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

export async function handlePiVerifyPost(request: Request, env: PiAuthEnv): Promise<Response> {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const origin = request.headers.get("Origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return json({ error: "Origin not allowed" }, 403);
  }

  if (!request.headers.get("Content-Type")?.toLowerCase().startsWith("application/json")) {
    return json({ error: "Content-Type must be application/json" }, 415);
  }

  const declaredLength = Number(request.headers.get("Content-Length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return json({ error: "Request is too large" }, 413);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(await readBodyWithinLimit(request)) as unknown;
  } catch (error) {
    return json({ error: error instanceof Error && error.message === "too-large" ? "Request is too large" : "Invalid request body" }, error instanceof Error && error.message === "too-large" ? 413 : 400);
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return json({ error: "Invalid request body" }, 400);
  }

  const accessToken = (parsed as { accessToken?: unknown }).accessToken;
  if (
    typeof accessToken !== "string" ||
    accessToken.length < 16 ||
    accessToken.length > MAX_ACCESS_TOKEN_LENGTH ||
    !/^[\x21-\x7e]+$/.test(accessToken)
  ) {
    return json({ error: "Invalid Pi access token" }, 400);
  }

  if (!env.PI_AUTH_LIMITER) return json({ error: "Pi verification is not configured" }, 503);

  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  try {
    const result = await env.PI_AUTH_LIMITER.limit({ key: `pi-auth:${ip}` });
    if (!result.success) return json({ error: "Too many verification attempts" }, 429);
  } catch {
    // Fail closed if the rate limiter cannot be reached.
    return json({ error: "Pi verification is temporarily unavailable" }, 503);
  }

  try {
    const piResponse = await fetch(PI_ME_ENDPOINT, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
      redirect: "error",
      signal: AbortSignal.timeout(8_000),
    });

    if (piResponse.status === 401 || piResponse.status === 403) {
      return json({ error: "Pi access token is invalid or expired" }, 401);
    }
    if (!piResponse.ok) return json({ error: "Pi identity service is unavailable" }, 502);

    const user = (await piResponse.json()) as { uid?: unknown; username?: unknown };
    if (
      typeof user.uid !== "string" || user.uid.length === 0 || user.uid.length > 255 ||
      typeof user.username !== "string" || user.username.length === 0 || user.username.length > 64
    ) {
      return json({ error: "Pi returned an invalid identity" }, 502);
    }

    return json({ user: { uid: user.uid, username: user.username } }, 200);
  } catch {
    // Never return the token, upstream response body, or network exception.
    return json({ error: "Pi identity service is unavailable" }, 502);
  }
}
