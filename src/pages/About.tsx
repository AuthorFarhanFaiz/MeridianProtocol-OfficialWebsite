import StatusBadge from "@/components/StatusBadge";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, FileText, Eye } from "lucide-react";

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-surface-border">
        <div className="container-page py-20 sm:py-28">
          <div className="mx-auto max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              Overview
            </p>
            <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              About Meridian Protocol
            </h1>

            <div className="mt-6">
              <StatusBadge status={PROJECT_STATUS.stage} tone="progress" />
            </div>

            <p className="mt-8 text-[16px] leading-relaxed text-ink-dim">
              Meridian Protocol is a transparency-first Web3 project built around{" "}
              {TOKEN_CONFIG.symbol}, a fixed-supply {TOKEN_CONFIG.standard} token
              deployed on {TOKEN_CONFIG.chain}.
            </p>
          </div>
        </div>
      </section>

      {/* Core Statement */}
      <section className="border-b border-surface-border">
        <div className="container-page py-16 sm:py-20">
          <div className="mx-auto max-w-3xl space-y-6 text-[15px] leading-relaxed text-ink-dim">
            <p>
              The token contract is live and verified. Supporting infrastructure
              — staking, vesting, and treasury timelock — is also deployed and
              source-verified. The surrounding ecosystem (independent audit,
              final tokenomics distribution mechanisms, liquidity, and broader
              utility) is being built and disclosed in stages, following the
              sequence shown on the roadmap.
            </p>
            <p>
              The guiding principle of this site is simple: status pages should
              describe what is actually true right now, not what is intended.
              Where something is planned rather than shipped, it is clearly
              labeled as Planned, In Progress, or Coming Soon.
            </p>
          </div>
        </div>
      </section>

      {/* What Exists Today */}
      <section className="border-b border-surface-border bg-surface/15">
        <div className="container-page py-16 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              Current State
            </p>
            <h2 className="mt-2 text-2xl font-medium text-ink">
              What exists on-chain today
            </h2>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Token Contract",
                  status: "Live & Verified",
                  desc: "Fixed-supply BEP-20. No owner, mint, pause, or blacklist functions.",
                },
                {
                  title: "Staking Contract",
                  status: "Live & Verified",
                  desc: "Holders can stake MRDN and earn rewards with no mandatory lock-up.",
                },
                {
                  title: "Team Vesting",
                  status: "Live & Funded",
                  desc: "18% allocation under 10-month cliff + 3-year linear release.",
                },
                {
                  title: "Treasury Timelock",
                  status: "Live & Funded",
                  desc: "15% allocation secured with a 3-day minimum delay.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-surface-border bg-base/60 p-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-[15px] font-medium text-ink">
                      {item.title}
                    </h3>
                    <span className="font-mono text-[11px] text-status-live">
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-ink-dim">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="border-b border-surface-border">
        <div className="container-page py-16 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              Principles
            </p>
            <h2 className="mt-2 text-2xl font-medium text-ink">
              How we communicate
            </h2>

            <div className="mt-10 space-y-8">
              {[
                {
                  icon: Eye,
                  title: "Transparency over narrative",
                  body: "We label unfinished work as unfinished. Planned features are never presented as live.",
                },
                {
                  icon: ShieldCheck,
                  title: "Verifiability first",
                  body: "Every on-chain claim points to a place it can be independently checked on BscScan.",
                },
                {
                  icon: FileText,
                  title: "Documentation discipline",
                  body: "The whitepaper and litepaper describe the technical and economic design without guaranteed-return language.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-5">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-surface-border bg-surface/40">
                    <item.icon className="h-4.5 w-4.5 text-line" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-medium text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-ink-dim">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps CTA */}
      <section>
        <div className="container-page py-16 sm:py-20">
          <div className="mx-auto max-w-3xl rounded-3xl border border-surface-border bg-surface/30 p-10 text-center sm:p-12">
            <h2 className="text-xl font-medium text-ink sm:text-2xl">
              Continue exploring
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[14.5px] text-ink-dim">
              For full technical details, security status, and economic design,
              start with the documentation.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/documentation"
                className="inline-flex items-center gap-2 rounded-full bg-line px-6 py-3 text-[13.5px] font-semibold text-base-deep transition-all hover:bg-line-soft"
              >
                Documentation
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/security"
                className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface/50 px-6 py-3 text-[13.5px] font-medium text-ink transition-all hover:border-line/30"
              >
                Security Status
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
      }
