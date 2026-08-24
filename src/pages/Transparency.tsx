import { ExternalLink } from "lucide-react";
import { TOKEN_CONFIG, SITE_CONFIG, DOCUMENTS, CONTRACTS } from "@/data/token";
import StatusBadge from "@/components/StatusBadge";
import { Link } from "react-router-dom";

function Row({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-surface-border py-4 transition-colors duration-300 last:border-0 hover:border-line/30 sm:flex-row sm:items-center sm:justify-between">
      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
        {label}
      </span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 break-all text-[13.5px] text-ink transition hover:text-line"
        >
          {value}
          <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
        </a>
      ) : (
        <span className="break-all text-[13.5px] text-ink">{value}</span>
      )}
    </div>
  );
}

export default function Transparency() {
  return (
    <div>
      <section className="border-b border-surface-border">
        <div className="container-page py-16 sm:py-20">
          <div className="mx-auto max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              Transparency
            </p>
            <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Transparency Center
            </h1>
            <p className="mt-5 text-[15.5px] leading-relaxed text-ink-dim">
              Every fact below can be independently verified — you don’t have to
              trust this website for any of it.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-surface-border">
        <div className="container-page py-12">
          <div className="mx-auto max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              Token
            </p>
            <h2 className="mt-2 text-xl font-medium text-ink">Core facts</h2>

            <div className="mt-6 rounded-2xl border border-surface-border bg-surface/25 px-5">
              <Row
                label="Contract address"
                value={TOKEN_CONFIG.contractAddress}
                href={TOKEN_CONFIG.explorerUrl}
              />
              <Row label="Network" value={TOKEN_CONFIG.chain} />
              <Row
                label="Token"
                value={`${TOKEN_CONFIG.name} (${TOKEN_CONFIG.symbol})`}
              />
              <Row
                label="Total supply"
                value={`${TOKEN_CONFIG.totalSupply} ${TOKEN_CONFIG.symbol}`}
              />
              <Row
                label="Source code"
                value={TOKEN_CONFIG.contractVerified ? "Verified" : "Unverified"}
                href={TOKEN_CONFIG.explorerUrl}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-surface-border bg-surface/10">
        <div className="container-page py-12">
          <div className="mx-auto max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              Infrastructure
            </p>
            <h2 className="mt-2 text-xl font-medium text-ink">
              Verified contracts
            </h2>

            <div className="mt-6 space-y-3">
              {Object.values(CONTRACTS).map((c) => (
                <div
                  key={c.address}
                  className="flex flex-col gap-2 rounded-2xl border border-surface-border bg-base/60 p-5 transition-all duration-300 hover:border-line/20 hover:shadow-glow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-[14.5px] font-medium text-ink">{c.name}</p>
                    <p className="mt-1 break-all font-mono text-[12px] text-ink-faint">
                      {c.address}
                    </p>
                  </div>
                  <a
                    href={c.explorer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[13px] text-ink-dim hover:text-ink"
                  >
                    BscScan <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-surface-border">
        <div className="container-page py-12">
          <div className="mx-auto max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              Documents & channels
            </p>
            <div className="mt-6 rounded-2xl border border-surface-border bg-surface/25 px-5">
              <Row
                label="Whitepaper"
                value={`PDF · ${DOCUMENTS.whitepaper.pages} pages`}
                href={DOCUMENTS.whitepaper.href}
              />
              <Row
                label="Litepaper"
                value={`PDF · ${DOCUMENTS.litepaper.pages} pages`}
                href={DOCUMENTS.litepaper.href}
              />
              <Row label="GitHub" value="Official repository" href={SITE_CONFIG.githubUrl} />
              <Row
                label="X (Twitter)"
                value={SITE_CONFIG.twitterHandle}
                href={SITE_CONFIG.twitterUrl}
              />
              <Row
                label="Telegram"
                value="Official channel"
                href={SITE_CONFIG.telegramUrl}
              />
              <Row
                label="Discord"
                value="Official server"
                href={SITE_CONFIG.discordUrl}
              />
              <Row
                label="Contact"
                value={SITE_CONFIG.contactEmail}
                href={`mailto:${SITE_CONFIG.contactEmail}`}
              />
            </div>

            <div className="mt-6 flex items-center justify-between rounded-2xl border border-surface-border bg-surface/25 px-5 py-4">
              <span className="text-[13.5px] text-ink">
                Independent manual security audit
              </span>
              <StatusBadge status="NOT YET COMPLETED" tone="progress" />
            </div>

            <p className="mt-8 text-[13px] leading-relaxed text-ink-faint">
              Always cross-check addresses on the{" "}
              <Link to="/official-links" className="underline underline-offset-2 hover:text-ink">
                Official Links Registry
              </Link>
              . Team profiles appear here only when a real, verifiable person is
              publicly associated — no placeholder team entries.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
              }
                
