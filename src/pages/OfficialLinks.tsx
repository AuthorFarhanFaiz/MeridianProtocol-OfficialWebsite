import { ExternalLink, ShieldAlert, Copy, Check } from "lucide-react";
import { useState } from "react";
import { SITE_CONFIG, CONTRACTS } from "@/data/token";

const SOCIAL_LINKS = [
  { label: "Website", value: SITE_CONFIG.domain, href: SITE_CONFIG.url },
  { label: "X (Twitter)", value: SITE_CONFIG.twitterHandle, href: SITE_CONFIG.twitterUrl },
  { label: "Telegram", value: "Official Channel", href: SITE_CONFIG.telegramUrl },
  { label: "Discord", value: "Official Server", href: SITE_CONFIG.discordUrl },
  { label: "GitHub", value: "Official Repository", href: SITE_CONFIG.githubUrl },
  {
    label: "Email",
    value: SITE_CONFIG.contactEmail,
    href: `mailto:${SITE_CONFIG.contactEmail}`,
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1 rounded-full border border-surface-border px-2.5 py-1 text-[11px] text-ink-dim transition hover:text-ink"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function OfficialLinks() {
  const contractList = Object.values(CONTRACTS);

  return (
    <div>
      <section className="border-b border-surface-border">
        <div className="container-page py-16 sm:py-20">
          <div className="mx-auto max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              Registry
            </p>
            <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Official Links Registry
            </h1>
            <p className="mt-5 text-[15.5px] leading-relaxed text-ink-dim">
              Bookmark this page. No other account, group, or website currently
              speaks for Meridian Protocol.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-surface-border">
        <div className="container-page py-12">
          <div className="mx-auto max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              Channels
            </p>
            <h2 className="mt-2 text-xl font-medium text-ink">Official Channels</h2>
            <div className="mt-6 divide-y divide-surface-border overflow-hidden rounded-2xl border border-surface-border">
              {SOCIAL_LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-base/50 px-5 py-4 transition-all duration-300 hover:translate-x-1 hover:bg-surface/40"
                >
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                      {l.label}
                    </p>
                    <p className="mt-0.5 text-[14px] text-ink">{l.value}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-ink-faint transition-colors group-hover:text-line" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-surface-border bg-surface/10">
        <div className="container-page py-12">
          <div className="mx-auto max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              On-Chain
            </p>
            <h2 className="mt-2 text-xl font-medium text-ink">Verified Contracts</h2>
            <div className="mt-6 space-y-4">
              {contractList.map((c) => (
                <div
                  key={c.address}
                  className="rounded-2xl border border-surface-border bg-base/60 p-5 transition-all duration-300 hover:border-line/20 hover:shadow-glow-sm"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-[15px] font-medium text-ink">{c.name}</p>
                      <p className="mt-1 break-all font-mono text-[12.5px] text-ink-faint">
                        {c.address}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CopyButton text={c.address} />
                      <a
                        href={c.explorer}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-surface-border px-3 py-1 text-[12px] text-ink-dim transition hover:text-ink"
                      >
                        BscScan <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container-page py-12">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-start gap-4 rounded-2xl border border-status-danger/30 bg-status-danger/10 p-6 shadow-[0_0_24px_-8px_rgba(255,69,58,0.35)]">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-status-danger" />
              <div className="text-[14px] leading-relaxed text-ink">
                <p>
                  Meridian Protocol will never DM you first, and will never
                  request your seed phrase, private key, or wallet password.
                </p>
                <p className="mt-2">
                  Always verify the contract address against this page before
                  interacting with MRDN.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
                  }
                  
