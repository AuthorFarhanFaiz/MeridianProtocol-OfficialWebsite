import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Shield } from "lucide-react";
import { BOT_NAME, BOT_TAGLINE, DAILY_MSG_LIMIT } from "@/data/chatKnowledge";
import {
  askMeridianGuide,
  getRemainingMessages,
} from "@/lib/meridianChat";

type Msg = {
  id: string;
  role: "user" | "guide";
  text: string;
};

const WELCOME: Msg = {
  id: "welcome",
  role: "guide",
  text: `I’m ${BOT_NAME} — official on-site help for Meridian Protocol. Ask about MRDN, contracts, staking, docs, roadmap, or security. Public facts only. Never share your seed phrase.`,
};

export default function MeridianGuide() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [remaining, setRemaining] = useState(DAILY_MSG_LIMIT);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRemaining(getRemainingMessages());
  }, [open, messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;

    const userMsg: Msg = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setBusy(true);

    try {
      // Canned facts answer instantly offline; anything else goes to
      // the live AI backend at /api/guide (Cloudflare Pages Function).
      const answer = await askMeridianGuide(text, { webEndpoint: "/api/guide" });
      setMessages((m) => [
        ...m,
        { id: `g-${Date.now()}`, role: "guide", text: answer },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: `g-${Date.now()}`,
          role: "guide",
          text: "Something went wrong. Please try again or open Documentation on the site.",
        },
      ]);
    } finally {
      setBusy(false);
      setRemaining(getRemainingMessages());
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  }

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-[60] flex h-13 items-center gap-2 rounded-full border border-line/40 bg-surface px-4 py-3 text-ink shadow-lg transition hover:border-line hover:bg-surface-raised"
        aria-label={open ? "Close Meridian Guide" : "Open Meridian Guide"}
      >
        {open ? (
          <X className="h-5 w-5 text-line" />
        ) : (
          <>
            <MessageCircle className="h-5 w-5 text-line" />
            <span className="hidden text-[13px] font-medium sm:inline">
              {BOT_NAME}
            </span>
          </>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          className="fixed bottom-20 right-5 z-[60] flex w-[min(100vw-2rem,380px)] flex-col overflow-hidden rounded-2xl border border-surface-border bg-base shadow-2xl"
          style={{ height: "min(560px, 70vh)" }}
          role="dialog"
          aria-label={BOT_NAME}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 border-b border-surface-border bg-surface/50 px-4 py-3">
            <div>
              <p className="font-display text-[15px] font-medium text-ink">
                {BOT_NAME}
              </p>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                {BOT_TAGLINE}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[11px] text-ink-dim">
                {remaining}/{DAILY_MSG_LIMIT} today
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-line text-base-deep"
                      : "border border-surface-border bg-surface/60 text-ink-dim"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {busy && (
              <p className="font-mono text-[11px] text-ink-faint">Thinking…</p>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Safety strip */}
          <div className="flex items-center gap-2 border-t border-surface-border bg-surface/30 px-4 py-2">
            <Shield className="h-3.5 w-3.5 shrink-0 text-line" />
            <p className="text-[11px] leading-snug text-ink-faint">
              Public facts only · No financial advice · Never share keys
            </p>
          </div>

          {/* Input */}
          <div className="flex gap-2 border-t border-surface-border p-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={busy || remaining <= 0}
              placeholder={
                remaining <= 0
                  ? "Daily limit reached — see docs"
                  : "Ask about MRDN, staking, contracts…"
              }
              className="min-w-0 flex-1 rounded-xl border border-surface-border bg-base px-3 py-2.5 text-[13.5px] text-ink outline-none placeholder:text-ink-faint focus:border-line/50"
              maxLength={500}
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => void send()}
              disabled={busy || remaining <= 0 || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-line text-base-deep transition hover:bg-line-soft disabled:opacity-40"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
        }
        
