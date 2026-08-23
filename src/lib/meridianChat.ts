import {
  CHAT_KNOWLEDGE,
  SAFETY_BLOCK_PATTERNS,
  FALLBACK_ANSWER,
} from "@/data/chatKnowledge";

const OWNER_CODE_KEY = "mrdn_guide_code_v1";
const OWNER_CONFIRMED_KEY = "mrdn_guide_owner_confirmed_v1";

/** The code the user typed via /unlock (unverified until the server confirms it). */
function getStoredCode(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(OWNER_CODE_KEY);
  } catch {
    return null;
  }
}

function setStoredCode(code: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(OWNER_CODE_KEY, code);
  } catch {
    /* ignore storage errors */
  }
}

/** True only after the server has actually confirmed the code once. */
export function isOwnerConfirmed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(OWNER_CONFIRMED_KEY) === "1";
  } catch {
    return false;
  }
}

function setOwnerConfirmed(v: boolean) {
  if (typeof window === "undefined") return;
  try {
    if (v) localStorage.setItem(OWNER_CONFIRMED_KEY, "1");
    else localStorage.removeItem(OWNER_CONFIRMED_KEY);
  } catch {
    /* ignore storage errors */
  }
}

export function checkSafety(input: string): string | null {
  const t = input.toLowerCase();

  for (const p of SAFETY_BLOCK_PATTERNS) {
    if (t.includes(p)) {
      return "⚠️ Notice: I can’t help with seed phrases, private keys, exploits, or harmful requests. Ask about public Meridian docs, contracts, or project status instead. Meridian will never ask for your keys.";
    }
  }

  if (
    /(fuck|shit|bitch|porn|xxx|sex with|nude)/i.test(t) &&
    !/(what is|token|contract|stake)/i.test(t)
  ) {
    return "⚠️ Notice: Please keep questions professional and related to Meridian Protocol.";
  }

  return null;
}

export function matchKnowledge(input: string): string | null {
  const t = input.toLowerCase().trim().replace(/\s+/g, " ");
  if (t.length < 2) {
    return "Please ask a short question about Meridian Protocol (token, staking, contracts, docs, roadmap, or security).";
  }

  let best: { score: number; answer: string } | null = null;

  for (const entry of CHAT_KNOWLEDGE) {
    let score = 0;
    for (const p of entry.patterns) {
      if (t.includes(p)) {
        score += p.length + 2;
      }
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { score, answer: entry.answer };
    }
  }

  return best ? best.answer : null;
}

export type AskOptions = {
  /** Optional Cloudflare Worker / API route — API keys must stay on the server */
  webEndpoint?: string;
};

/**
 * Owner unlock: stores the typed code locally and sends it with the next
 * request. The server (functions/api/guide.ts) is the only place that
 * actually knows the real code (a Cloudflare secret) — this function
 * never validates it client-side.
 */
export function storeOwnerCode(code: string) {
  setStoredCode(code);
  setOwnerConfirmed(false); // unconfirmed until the server says otherwise
}

/**
 * Main entry: safety → offline knowledge (always free) → live AI
 * (server enforces the daily per-IP limit; the owner code bypasses it) → fallback.
 */
export async function askMeridianGuide(
  input: string,
  opts: AskOptions = {}
): Promise<string> {
  const trimmed = input.trim();
  if (!trimmed) {
    return "Please type a question about Meridian Protocol.";
  }

  const safety = checkSafety(trimmed);
  if (safety) return safety;

  const local = matchKnowledge(trimmed);
  if (local) return local;

  if (opts.webEndpoint) {
    try {
      const code = getStoredCode();
      const res = await fetch(opts.webEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: trimmed, code: code ?? undefined }),
      });
      if (res.ok) {
        const data = (await res.json()) as { answer?: string; ownerVerified?: boolean };
        if (typeof data.ownerVerified === "boolean") {
          setOwnerConfirmed(data.ownerVerified);
        }
        if (data.answer && data.answer.trim()) {
          return data.answer.trim();
        }
      }
    } catch {
      /* network failure → fallback */
    }
  }

  return FALLBACK_ANSWER;
}
