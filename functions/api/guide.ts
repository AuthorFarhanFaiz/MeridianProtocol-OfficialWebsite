/**
 * Cloudflare Pages Function — POST /api/guide
 *
 * Live AI backend for the on-site "Meridian Guide" chatbot.
 * The API key NEVER ships to the browser — it lives only as a
 * Cloudflare secret (set via `wrangler pages secret put OPENROUTER_API_KEY`
 * or the Pages dashboard → Settings → Environment variables → Secret).
 *
 * Provider: OpenRouter (openrouter.ai) — free tier, no credit card.
 * OpenRouter's free (":free") model roster rotates week to week as
 * providers add/remove capacity, so this never hard-codes a single
 * model. It tries a short list of candidates in order and falls back
 * automatically if one is rate-limited or delisted.
 */

import {
  CHAT_SYSTEM_PROMPT,
  CHAT_KNOWLEDGE,
  SAFETY_BLOCK_PATTERNS,
  FALLBACK_ANSWER,
} from "../../src/data/chatKnowledge";

interface Env {
  OPENROUTER_API_KEY: string;
  SITE_URL?: string;
}

interface RequestContext {
  request: Request;
  env: Env;
}

// Ordered fallback list — first one that responds successfully wins.
// Update this list from https://openrouter.ai/models?fmt=cards&order=pricing-low-to-high
// whenever a model gets delisted (OpenRouter returns 404/429 for dead ones,
// which is exactly what triggers the fallback below).
const MODEL_CANDIDATES = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "google/gemma-3-27b-it:free",
  "qwen/qwen3-235b-a22b:free",
  "nvidia/nemotron-nano-9b-v2:free",
];

const MAX_QUESTION_LEN = 500;

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

// Compact grounding context so the model stays factually anchored to
// the real project instead of inventing token facts, prices, or promises.
function buildKnowledgeContext(): string {
  return CHAT_KNOWLEDGE.map((e) => `Q: ${e.patterns[0]}\nA: ${e.answer}`).join(
    "\n\n"
  );
}

export const onRequestOptions = async ({ request }: RequestContext): Promise<Response> => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request.headers.get("Origin")),
  });
};

export const onRequestPost = async ({ request, env }: RequestContext): Promise<Response> => {
  const origin = request.headers.get("Origin");

  let body: { q?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body" }, 400, origin);
  }

  const question = (body.q ?? "").toString().trim();

  if (!question) {
    return json({ answer: "Please type a question about Meridian Protocol." }, 200, origin);
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

  if (!env.OPENROUTER_API_KEY) {
    // No key configured yet — let the client fall back to the
    // offline knowledge base instead of erroring the widget out.
    return json({ answer: null }, 200, origin);
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

      if (!res.ok) {
        // Rate-limited or delisted — try the next candidate.
        continue;
      }

      const data = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const answer = data.choices?.[0]?.message?.content?.trim();

      if (answer) {
        return json({ answer }, 200, origin);
      }
    } catch {
      // Network error on this model — try the next one.
      continue;
    }
  }

  // Every model candidate failed — let the client fall back gracefully.
  return json({ answer: FALLBACK_ANSWER }, 200, origin);
};
    
