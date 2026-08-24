import { Layers, ShieldCheck, Link2, GitBranch } from "lucide-react";
import { TOKEN_CONFIG, CONTRACTS } from "@/data/token";
import StatusBadge from "@/components/StatusBadge";
import { Link } from "react-router-dom";

const ARCHITECTURE_LAYERS = [
  {
    layer: "BNB Smart Chain",
    status: "LIVE",
    desc: "Base settlement layer where MRDN and related contracts are deployed.",
  },
  {
    layer: "MRDN Token Contract",
    status: "LIVE",
    desc: "Fixed-supply BEP-20. Verified. No owner, mint, pause, or blacklist.",
  },
  {
    layer: "Staking · Vesting · Treasury Timelock",
    status: "LIVE",
    desc: "Supporting contracts deployed and source-verified on BscScan.",
  },
  {
    layer: "Documentation & transparency layer",
    status: "LIVE",
    desc: "Public site, status labels, and verifiable on-chain references.",
  },
  {
    layer: "Broader ecosystem / applications",
    status: "IN DEVELOPMENT",
    desc: "Utility and product modules — scoped as capacity allows.",
  },
  {
    layer: "Future modules",
    status: "PLANNED",
    desc: "Any additional application layer — only once justified and built.",
  },
];

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "Transparency",
    body: "Every status claim on this site is labeled by what’s actually true, with a path to verify it independently.",
  },
  {
    icon: Link2,
    title: "On-chain verification",
    body: "Contract facts (address, supply, admin surface) are verifiable on BscScan, not only asserted here.",
  },
  {
    icon: Layers,
    title: "Deterministic execution",
    body: "MRDN’s core token behavior is defined by verified bytecode — no owner-based mint or pause on the token.",
  },
  {
    icon: GitBranch,
    title: "Composability",
    body: "As a standard BEP-20, MRDN works with standard wallets, explorers, and BNB Chain tooling by default.",
  },
];

export default function Technology() {
  return (
    <div>
      <section className="border-b border-surface-border">
        <div className="container-page py-16 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              Technology
            </p>
            <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              How Meridian is built
            </h1>
            <p className="mt-5 max-w-2xl text-[15.5px] leading-relaxed text-ink-dim">
              Meridian is a token and supporting contracts on {TOKEN_CONFIG.chain},
              plus public documentation — not a custom Layer-1 or VM. This page
              describes what that means today, and what is planned rather than live.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-surface-border">
        <div className="container-page py-14">
          <div className="mx-auto max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              Stack
            </p>
            <h2 className="mt-2 text-xl font-medium text-ink">Architecture</h2>

            <div className="relative mt-10 space-y-8 border-l border-surface-border pl-8 sm:pl-10">
              {ARCHITECTURE_LAYERS.map((l) => (
                <div key={l.layer} className="relative">
                  <span className="absolute -left-[41px] top-1.5 flex h-3.5 w-3.5 sm:-left-[49px]">
                    {l.status === "IN DEVELOPMENT" && (
                      <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-status-progress" />
                    )}
                    <span
                      className={`relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-base ${
                        l.status === "LIVE"
                          ? "bg-status-live shadow-[0_0_10px_rgba(52,199,89,0.5)]"
                          : l.status === "IN DEVELOPMENT"
                          ? "bg-status-progress"
                          : "bg-line/40"
                      }`}
                    />
                  </span>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-[15px] font-medium text-ink">{l.layer}</h3>
                    <StatusBadge
                      status={l.status}
                      tone={
                        l.status === "LIVE"
                          ? "live"
                          : l.status === "IN DEVELOPMENT"
                          ? "progress"
                          : "planned"
                      }
                    />
                  </div>
                  <p className="mt-2 max-w-xl text-[14px] text-ink-dim">{l.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-surface-border bg-surface/10">
        <div className="container-page py-14">
          <div className="mx-auto max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              Contract
            </p>
            <h2 className="mt-2 text-xl font-medium text-ink">Token specification</h2>

            <div className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-2">
              {[
                { label: "Blockchain", value: TOKEN_CONFIG.chain },
                { label: "Standard", value: TOKEN_CONFIG.standard },
                {
                  label: "Contract address",
                  value: TOKEN_CONFIG.contractAddress,
                  mono: true,
                },
                {
                  label: "Source verification",
                  value: TOKEN_CONFIG.contractVerified
                    ? "Verified on BscScan"
                    : "Unverified",
                },
              ].map((f) => (
                <div key={f.label} className="border-b border-surface-border pb-4 transition-colors duration-300 hover:border-line/30">
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
                    {f.label}
                  </p>
                  <p
                    className={`mt-1.5 text-[14px] text-ink ${
                      f.mono ? "break-all font-mono text-[13px]" : ""
                    }`}
                  >
                    {f.value}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-8 text-[13.5px] text-ink-dim">
              Supporting contracts (staking, vesting, treasury): see{" "}
              <Link to="/token" className="underline underline-offset-2 hover:text-ink">
                Token
              </Link>{" "}
              and{" "}
              <Link to="/official-links" className="underline underline-offset-2 hover:text-ink">
                Official Links
              </Link>
              . Count: {Object.keys(CONTRACTS).length} verified entries in registry.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="container-page py-14">
          <div className="mx-auto max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              Design
            </p>
            <h2 className="mt-2 text-xl font-medium text-ink">Technical principles</h2>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {PRINCIPLES.map((p) => (
                <div
                  key={p.title}
                  className="group rounded-2xl border border-surface-border bg-surface/30 p-6 transition-all duration-300 hover:border-line/20 hover:shadow-glow-sm"
                >
                  <p.icon className="h-5 w-5 text-line transition-transform duration-300 group-hover:scale-110" />
                  <h3 className="mt-4 text-[15px] font-medium text-ink">{p.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink-dim">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
                      }
                        
