import {
  CHAT_KNOWLEDGE,
  SAFETY_BLOCK_PATTERNS,
  DAILY_MSG_LIMIT,
  FALLBACK_ANSWER,
} from "@/data/chatKnowledge";

const STORAGE_KEY = "mrdn_guide_daily_v1";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getRemainingMessages(): number {
  if (typeof window === "undefined") return DAILY_MSG_LIMIT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DAILY_MSG_LIMIT;
    const data = JSON.parse(raw) as { day: string; count: number };
    if (data.day !== todayKey()) return DAILY_MSG_LIMIT;
    return Math.max(0, DAILY_MSG_LIMIT - (data.count || 0));
  } catch {
    return DAILY_MSG_LIMIT;
  }
}

export function consumeMessage(): boolean {
  if (typeof window === "undefined") return true;
  const left = getRemainingMessages();
  if (left <= 0) return false;
  const day = todayKey();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let count = 0;
    if (raw) {
      const data = JSON.parse(raw) as { day: string; count: number };
      if (data.day === day) count = data.count || 0;
    }
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ day, count: count + 1 })
    );
  } catch {
    /* ignore storage errors */
  }
  return true;
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
 * Main entry: safety → daily limit → offline knowledge → optional web → fallback
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

  if (!consumeMessage()) {
    return `You’ve reached today’s limit (${DAILY_MSG_LIMIT} messages). Please try again tomorrow, or read the docs at meridianprotocol.site/documentation.`;
  }

  const local = matchKnowledge(trimmed);
  if (local) return local;

  if (opts.webEndpoint) {
    try {
      const res = await fetch(opts.webEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: trimmed }),
      });
      if (res.ok) {
        const data = (await res.json()) as { answer?: string };
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
