/**
 * Cloudflare Pages Function — POST /api/guide
 *
 * Live AI backend for the on-site "Meridian Guide" chatbot.
 *
 * Two secrets live ONLY on the server (Cloudflare Pages → Settings →
 * Environment variables → Secret) — never in this repo, never in the
 * browser bundle:
 *   - OPENROUTER_API_KEY   → wrangler pages secret put OPENROUTER_API_KEY
 *   - OWNER_UNLOCK_CODE    → wrangler pages secret put OWNER_UNLOCK_CODE
 *
 * Rate limiting is done server-side per IP address using a Cloudflare
 * KV namespace (bound as GUIDE_KV) — this can't be bypassed by clearing
 * browser storage or opening a private window, unlike a client-only limit.
 * Anyone who sends the correct OWNER_UNLOCK_CODE skips the limit entirely.
 *
 * Provider: OpenRouter (openrouter.ai) — free tier, no credit card.
 * OpenRouter's free (":free") model roster rotates week to week, so this
 * never hard-codes a single model — it tries a short candidate list in
 * order and falls back automatically if one is rate-limited or delisted.
 */

import {
  CHAT_SYSTEM_PROMPT,
  CHAT_KNOWLEDGE,
  SAFETY_BLOCK_PATTERNS,
  FALLBACK_ANSWER,
  DAILY_AI_LIMIT,
} from "../../src/data/chatKnowledge";

interface Env {
  OPENROUTER_API_KEY: string;
  OWNER_UNLOCK_CODE?: string;
  SITE_URL?: string;
  // Optional — if not bound, rate limiting is skipped gracefully (open access).
  GUIDE_KV?: KVNamespaceLike;
}

// Minimal shape of the Cloudflare KV binding — avoids needing the
// @cloudflare/workers-types package as a dependency.
interface KVNamespaceLike {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
}

interface RequestContext {
  request: Request;
  env: Env;
}

const MODEL_CANDIDATES = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "google/gemma-3-27b-it:free",
  "qwen/qwen3-235b-a22b:free",
  "nvidia/nemotron-nano-9b-v2:free",
];

const MAX_QUESTION_LEN = 500;
const ONE_DAY_SECONDS = 60 * 60 * 24;

function corsHeaders(origin: string | null): HeadersInit {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function json(data: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders(origin),
  });
}

function violatesSafety(input: string): boolean {
  const t = input.toLowerCase();
  return SAFETY_BLOCK_PATTERNS.some((p) => t.includes(p));
}

function buildKnowledgeContext(): string {
  return CHAT_KNOWLEDGE.map((e) => `Q: ${e.patterns[0]}\nA: ${e.answer}`).join(
    "\n\n"
  );
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Returns true if this IP is still under today's limit (and records the call). */
async function allowAndRecord(kv: KVNamespaceLike | undefined, ip: string): Promise<boolean> {
  if (!kv) return true; // no KV bound yet → don't block anyone
  const key = `guide:${ip}:${todayKey()}`;
  const raw = await kv.get(key);
  const count = raw ? parseInt(raw, 10) || 0 : 0;
  if (count >= DAILY_AI_LIMIT) return false;
  await kv.put(key, String(count + 1), { expirationTtl: ONE_DAY_SECONDS });
  return true;
}

export const onRequestOptions = async ({ request }: RequestContext): Promise<Response> => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request.headers.get("Origin")),
  });
};

export const onRequestPost = async ({ request, env }: RequestContext): Promise<Response> => {
  const origin = request.headers.get("Origin");

  let body: { q?: string; code?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body" }, 400, origin);
  }

  const question = (body.q ?? "").toString().trim();
  const submittedCode = (body.code ?? "").toString().trim();
  const isOwner = Boolean(env.OWNER_UNLOCK_CODE) && submittedCode === env.OWNER_UNLOCK_CODE;

  if (!question) {
    return json({ answer: "Please type a question about Meridian Protocol.", ownerVerified: isOwner }, 200, origin);
  }

  if (question.length > MAX_QUESTION_LEN) {
    return json(
      { answer: `Please keep questions under ${MAX_QUESTION_LEN} characters.` },
      200,
      origin
    );
  }

  if (violatesSafety(question)) {
    return json(
      {
        answer:
          "⚠️ I can’t help with seed phrases, private keys, exploits, or harmful requests. Ask about public Meridian docs, contracts, or project status instead. Meridian will never ask for your keys.",
      },
      200,
      origin
    );
  }

  if (!isOwner) {
    const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
    const allowed = await allowAndRecord(env.GUIDE_KV, ip);
    if (!allowed) {
      return json(
        {
          answer:
            "I’ve used today’s free live-AI capacity for now — but I can still answer from my built-in Meridian knowledge base, or try the live assistant again tomorrow.",
        },
        200,
        origin
      );
    }
  }

  if (!env.OPENROUTER_API_KEY) {
    return json({ answer: null, ownerVerified: isOwner }, 200, origin);
  }

  const systemPrompt = `${CHAT_SYSTEM_PROMPT}

You have the following verified public knowledge base about Meridian Protocol.
Answer naturally and conversationally, in your own words — do not say "according to my knowledge base" or reveal that you were given reference notes.
Only use facts from this list; if the question falls outside it, say you don't have that public detail yet and point to meridianprotocol.site Documentation.
Keep answers under 80 words unless the user asks for detail. Never invent prices, yields, dates, or promises.

--- KNOWLEDGE BASE ---
${buildKnowledgeContext()}
--- END KNOWLEDGE BASE ---`;

  for (const model of MODEL_CANDIDATES) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": env.SITE_URL ?? "https://meridianprotocol.site",
          "X-Title": "Meridian Guide",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: question },
          ],
          max_tokens: 300,
          temperature: 0.4,
        }),
      });

      if (!res.ok) continue;

      const data = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const answer = data.choices?.[0]?.message?.content?.trim();

      if (answer) {
        return json({ answer, ownerVerified: isOwner }, 200, origin);
      }
    } catch {
      continue;
    }
  }

  return json({ answer: FALLBACK_ANSWER, ownerVerified: isOwner }, 200, origin);
};
  
