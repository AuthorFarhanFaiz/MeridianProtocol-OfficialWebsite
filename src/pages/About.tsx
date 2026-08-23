import { TOKEN_CONFIG, PROJECT_STATUS } from "@/data/token";
import StatusBadge from "@/components/StatusBadge";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, FileText, Eye } from "lucide-react";

export default function About() {
  return (
    <div>
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

      <section className="border-b border-surface-border">
        <div className="container-page py-16 sm:py-20">
          <div className="mx-auto max-w-3xl space-y-6 text-[15px] leading-relaxed text-ink-dim">
            <p>
              The token contract is live and verified. Supporting infrastructure —
              staking, vesting, and treasury timelock — is also deployed and
              source-verified. The surrounding ecosystem is being built and
              disclosed in stages, following the roadmap.
            </p>
            <p>
              The guiding principle of this site is simple: status pages should
              describe what is actually true right now, not what is intended.
            </p>
          </div>
        </div>
      </section>

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
                  desc: "Fixed-supply BEP-20. No owner, mint, pause, or blacklist.",
                },
                {
                  title: "Staking Contract",
                  status: "Live & Verified",
                  desc: "Stake MRDN and earn rewards with no mandatory lock-up.",
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
                  className="rounded-2xl border border-surface-border bg-base/60 p-6 transition-all duration-300 hover:border-line/20 hover:shadow-glow-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-[15px] font-medium text-ink">{item.title}</h3>
                    <span className="shrink-0 font-mono text-[11px] text-status-live">
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

      <section className="border-b border-surface-border">
        <div className="container-page py-16 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              Principles
            </p>
            <h2 className="mt-2 text-2xl font-medium text-ink">How we communicate</h2>
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
                  body: "Whitepaper and litepaper describe the design without guaranteed-return language.",
                },
              ].map((item) => (
                <div key={item.title} className="group flex gap-5">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-surface-border bg-surface/40 transition-all duration-300 group-hover:scale-110 group-hover:border-line/40 group-hover:shadow-glow-sm">
                    <item.icon className="h-4 w-4 text-line" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-medium text-ink">{item.title}</h3>
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

      <section>
        <div className="container-page py-16 sm:py-20">
          <div className="mx-auto max-w-3xl rounded-3xl border border-surface-border bg-surface/30 p-10 text-center sm:p-12">
            <h2 className="text-xl font-medium text-ink sm:text-2xl">
              Continue exploring
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[14.5px] text-ink-dim">
              For full technical details and security status, start with the documentation.
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
      
