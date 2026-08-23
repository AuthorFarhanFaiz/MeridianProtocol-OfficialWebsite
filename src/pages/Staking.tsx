import { ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";
import { TOKEN_CONFIG, CONTRACTS } from "@/data/token";
import StatusBadge from "@/components/StatusBadge";

const STAKING = CONTRACTS.staking;

const FACTS: { label: string; value: string }[] = [
  { label: "Contract Name", value: "MeridianStaking" },
  { label: "Network", value: TOKEN_CONFIG.chain },
  { label: "Lock Period", value: "None — unstake principal at any time" },
  { label: "Reward Asset", value: TOKEN_CONFIG.symbol },
  { label: "Source Verification", value: "Verified on BscScan" },
  { label: "Status", value: "Live" },
];

const SECURITY_FACTS: { label: string; value: string }[] = [
  { label: "Source Code", value: "Verified on BscScan" },
  { label: "Automated Scan (SolidityScan)", value: "90.77/100 — 0 Critical, 0 High" },
  { label: "Independent Manual Audit", value: "Not yet completed" },
  {
    label: "Owner Permissions",
    value: "Can set reward rate and fund the reward pool only. Cannot withdraw staker principal.",
  },
];

export default function Staking() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(STAKING.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div>
      {/* Header */}
      <section className="border-b border-surface-border">
        <div className="container-page py-16 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              Protocol
            </p>
            <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Staking
            </h1>
            <div className="mt-5">
              <StatusBadge status="LIVE" tone="live" />
            </div>
            <p className="mt-6 max-w-2xl text-[15.5px] leading-relaxed text-ink-dim">
              Stake {TOKEN_CONFIG.symbol} and earn continuously accruing rewards from a
              verified, non-custodial contract. No lock-in period — unstake your full
              principal whenever you choose.
            </p>
          </div>
        </div>
      </section>

      {/* Contract Card */}
      <section className="border-b border-surface-border">
        <div className="container-page py-12">
          <div className="mx-auto max-w-3xl">
            <div className="relative overflow-hidden rounded-2xl border border-surface-border bg-surface/40 p-6">
              <div className="pointer-events-none absolute inset-0 card-glow" aria-hidden="true" />
              <div className="relative">
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-faint">
                Staking Contract Address
              </p>
              <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="break-all font-mono text-[14px] text-ink">
                  {STAKING.address}
                </p>
                <div className="flex shrink-0 gap-2.5">
                  <button
                    onClick={copy}
                    className="inline-flex items-center gap-1.5 rounded-full border border-surface-border bg-surface/60 px-4 py-2.5 text-[13px] font-medium text-ink-dim transition-all hover:border-line/30 hover:text-ink"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <a
                    href={STAKING.explorer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shine-sweep inline-flex items-center gap-1.5 rounded-full bg-line px-5 py-2.5 text-[13px] font-semibold text-base-deep transition-all hover:bg-line-soft hover:shadow-glow-sm"
                  >
                    BscScan <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facts */}
      <section className="border-b border-surface-border">
        <div className="container-page py-14">
          <div className="mx-auto max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              Details
            </p>
            <h2 className="mt-2 text-xl font-medium text-ink">Key Facts</h2>

            <div className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2">
              {FACTS.map((f) => (
                <div key={f.label} className="border-b border-surface-border pb-4 transition-colors duration-300 hover:border-line/30">
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
                    {f.label}
                  </p>
                  <p className="mt-1.5 text-[15px] text-ink">{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-surface-border bg-surface/10">
        <div className="container-page py-14">
          <div className="mx-auto max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              Process
            </p>
            <h2 className="mt-2 text-xl font-medium text-ink">How it works</h2>

            <ol className="mt-8 space-y-5">
              {[
                `Approve the staking contract to spend your ${TOKEN_CONFIG.symbol}.`,
                "Stake any amount — rewards begin accruing continuously from that point.",
                "Claim accrued rewards at any time. Unstake your full principal whenever you choose — there is no lock period.",
              ].map((step, i) => (
                <li key={i} className="group flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line/30 bg-line/10 font-mono text-[12px] text-line transition-all duration-300 group-hover:scale-110 group-hover:bg-line/20">
                    {i + 1}
                  </span>
                  <p className="pt-0.5 text-[15px] leading-relaxed text-ink-dim">
                    {step}
                  </p>
                </li>
              ))}
            </ol>

            <p className="mt-8 rounded-2xl border border-surface-border bg-base/60 p-5 text-[13.5px] leading-relaxed text-ink-faint">
              Rewards are only paid while the reward pool is funded and an active
              reward rate is set. Check the reward pool balance directly on BscScan
              before relying on any projected returns. Meridian Protocol does not
              promise a fixed or guaranteed APY.
            </p>
          </div>
        </div>
      </section>

      {/* Security */}
      <section>
        <div className="container-page py-14">
          <div className="mx-auto max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              Security
            </p>
            <h2 className="mt-2 text-xl font-medium text-ink">Current Status</h2>

            <div className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2">
              {SECURITY_FACTS.map((f) => (
                <div key={f.label} className="border-b border-surface-border pb-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
                    {f.label}
                  </p>
                  <p className="mt-1.5 text-[14px] text-ink">{f.value}</p>
                </div>
              ))}
            </div>

            <p className="mt-8 text-[13px] leading-relaxed text-ink-faint">
              Staking involves smart contract risk. This contract has not yet
              undergone an independent manual security audit. See the{" "}
              <a href="/security" className="underline underline-offset-2 hover:text-ink">
                Security Center
              </a>{" "}
              for full status.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
                              }
            
