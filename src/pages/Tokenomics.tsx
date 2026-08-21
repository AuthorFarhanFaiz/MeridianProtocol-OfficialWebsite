import { TOKEN_CONFIG } from "@/data/token";
import { ALLOCATION_CATEGORIES, TOKENOMICS_NOTE } from "@/data/tokenomics";
import StatusBadge from "@/components/StatusBadge";

export default function Tokenomics() {
  return (
    <div>
      {/* Header */}
      <section className="border-b border-surface-border">
        <div className="container-page py-16 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              Economics
            </p>
            <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Tokenomics
            </h1>
            <p className="mt-5 max-w-2xl text-[15.5px] leading-relaxed text-ink-dim">
              {TOKENOMICS_NOTE}
            </p>
          </div>
        </div>
      </section>

      {/* Total Supply */}
      <section className="border-b border-surface-border">
        <div className="container-page py-12">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-surface-border bg-surface/40 p-8 text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-faint">
                Total Supply
              </p>
              <p className="mt-3 font-display text-3xl font-medium text-ink sm:text-4xl">
                {TOKEN_CONFIG.totalSupply}{" "}
                <span className="text-ink-dim">{TOKEN_CONFIG.symbol}</span>
              </p>
              <p className="mt-2 text-[13.5px] text-ink-faint">
                Fixed at deployment · No mint function exists
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Allocation Table */}
      <section className="border-b border-surface-border bg-surface/10">
        <div className="container-page py-14">
          <div className="mx-auto max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              Distribution
            </p>
            <h2 className="mt-2 text-xl font-medium text-ink">Allocation</h2>
            <p className="mt-3 text-[14px] text-ink-dim">
              Percentages are finalized. On-chain distribution mechanisms are being
              deployed progressively. Status reflects exactly what is live today.
            </p>

            <div className="mt-8 divide-y divide-surface-border overflow-hidden rounded-2xl border border-surface-border">
              {ALLOCATION_CATEGORIES.map((c) => (
                <div
                  key={c.id}
                  className="flex flex-col gap-3 bg-base/60 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-[15px] font-medium text-ink">
                        {c.name}
                      </span>
                      {c.percent && (
                        <span className="font-mono text-[13px] text-line">
                          {c.percent}
                        </span>
                      )}
                    </div>
                    {c.tokens && (
                      <p className="mt-1 text-[13px] text-ink-faint">
                        {c.tokens} MRDN
                      </p>
                    )}
                    {c.note && (
                      <p className="mt-1 text-[12.5px] text-ink-faint">{c.note}</p>
                    )}
                  </div>
                  <StatusBadge
                    status={c.status}
                    tone={
                      c.status === "Vesting" || c.status === "Live"
                        ? "live"
                        : c.status === "Confirmed"
                        ? "progress"
                        : "planned"
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section>
        <div className="container-page py-12">
          <div className="mx-auto max-w-3xl">
            <p className="text-[13px] leading-relaxed text-ink-faint">
              Tokenomics figures on this page are informational and subject to the
              official project documentation (Whitepaper / Litepaper). This is not
              financial, investment, or legal advice. Always verify on-chain data
              independently.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
      }
