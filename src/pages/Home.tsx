import { ArrowRight, FileText, Github, ShieldCheck, Copy, Check, BookOpen } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "@/components/Button";
import StatusBadge from "@/components/StatusBadge";
import MeridianField from "@/components/MeridianField";
import { TOKEN_CONFIG, PROJECT_STATUS, DOCUMENTS, SITE_CONFIG } from "@/data/token";
import { ROADMAP } from "@/data/roadmap";

function ContractRow() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(TOKEN_CONFIG.contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-surface-border bg-surface/50 p-5 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-faint">
          Contract Address
        </p>
        <p className="mt-1.5 truncate font-mono text-[13.5px] text-ink">
          {TOKEN_CONFIG.contractAddress}
        </p>
      </div>
      <div className="flex shrink-0 gap-2.5">
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-full border border-surface-border bg-surface/60 px-4 py-2.5 text-[13px] font-medium text-ink-dim transition-all hover:border-line/30 hover:text-ink"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
        <a
          href={TOKEN_CONFIG.explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-line px-5 py-2.5 text-[13px] font-semibold text-base-deep transition-all hover:bg-line-soft hover:shadow-glow-sm"
        >
          BscScan
        </a>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-surface-border">
        <MeridianField className="grid-field" />
        <div className="absolute inset-0 hero-glow pointer-events-none" />

        <div className="container-page relative py-28 sm:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 flex justify-center animate-fadeUp">
              <StatusBadge status={PROJECT_STATUS.stage} tone="progress" />
            </div>

            <h1
              className="animate-fadeUp font-display text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem]"
              style={{ animationDelay: "80ms" }}
            >
              Coordinates for a<br />
              transparent Web3 protocol.
            </h1>

            <p
              className="mx-auto mt-7 max-w-xl animate-fadeUp text-[16px] leading-relaxed text-ink-dim"
              style={{ animationDelay: "160ms" }}
            >
              Meridian Protocol is a fixed-supply BEP-20 token on {TOKEN_CONFIG.chain}.
              Every claim on this site is labeled by what’s actually true today —
              not what’s planned.
            </p>

            <div
              className="mt-10 flex animate-fadeUp flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap"
              style={{ animationDelay: "240ms" }}
            >
              <Button href="/about" icon={<ArrowRight className="h-4 w-4" />}>
                Explore Protocol
              </Button>
              <a href="https://meridianprotocol-officialwebsite.farhanfaiz-author.workers.dev/app/" className="inline-flex items-center justify-center gap-2 rounded-full bg-line px-5 py-3 text-[14px] font-semibold text-base-deep transition-all hover:bg-line-soft hover:shadow-glow-sm">
                Open Meridian App
                <ArrowRight className="h-4 w-4" />
              </a>
              <Button
                href={DOCUMENTS.whitepaper.href}
                variant="secondary"
                external
                icon={<FileText className="h-4 w-4" />}
              >
                Read Whitepaper
              </Button>
              <Button href="/documentation" variant="secondary" icon={<BookOpen className="h-4 w-4" />}>
                Documentation
              </Button>
              <Button
                href={SITE_CONFIG.githubUrl}
                variant="ghost"
                external
                icon={<Github className="h-4 w-4" />}
              >
                GitHub
              </Button>
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-2xl animate-fadeUp" style={{ animationDelay: "320ms" }}>
            <ContractRow />
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-surface-border bg-surface/20">
        <div className="container-page grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
          {[
            { label: "Blockchain", value: TOKEN_CONFIG.chain },
            { label: "Token Standard", value: TOKEN_CONFIG.standard },
            { label: "Total Supply", value: `${TOKEN_CONFIG.totalSupply} ${TOKEN_CONFIG.symbol}` },
            {
              label: "Contract Status",
              value: TOKEN_CONFIG.contractVerified ? "Verified" : "Unverified",
            },
          ].map((item, i) => (
            <div
              key={item.label}
              className={i > 0 ? "sm:border-l sm:border-surface-border sm:pl-8" : ""}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-faint">
                {item.label}
              </p>
              <p className="mt-2 text-[15px] font-medium text-ink">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Meridian */}
      <section className="border-b border-surface-border">
        <div className="container-page py-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
            Why Meridian?
          </p>

          <div className="mt-10 grid gap-10 sm:grid-cols-2">
            {[
              {
                q: "Problem",
                a: "Many token websites present intentions as facts — marking unfinished work as done, or product features as live before they exist.",
              },
              {
                q: "Approach",
                a: "Every status on this site is labeled by what’s actually true today, with a way to check it independently — not by what’s planned.",
              },
              {
                q: "Technology",
                a: `A fixed-supply ${TOKEN_CONFIG.standard} token on ${TOKEN_CONFIG.chain}, verified on-chain, with no owner, mint, pause, or blacklist function.`,
              },
              {
                q: "Evidence",
                a: "The contract, the source code, the supply, and every document referenced here can be checked directly — see the Transparency Center.",
              },
            ].map((item) => (
              <div key={item.q} className="group">
                <h3 className="font-mono text-[12px] uppercase tracking-[0.12em] text-ink-faint">
                  {item.q}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-dim">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="container-page py-24">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "Security-first disclosure",
              body: "Audit status, contract admin surface, and legal review status are all shown plainly — including what has not happened yet.",
            },
            {
              icon: FileText,
              title: "Documented, not hyped",
              body: "A detailed whitepaper and litepaper lay out the technical and economic design without guaranteed-return language.",
            },
            {
              icon: Github,
              title: "Built in the open",
              body: "Development, deployment history, and roadmap status are tracked publicly as the project actually progresses.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-surface-border bg-surface/30 p-7 transition-all duration-300 hover:border-line/20 hover:bg-surface/50 hover:shadow-glow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-line/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-line/20">
                <f.icon className="h-5 w-5 text-line" />
              </div>
              <h3 className="mt-5 text-[16px] font-medium text-ink">{f.title}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-dim">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap teaser */}
      <section className="border-t border-surface-border bg-surface/15">
        <div className="container-page py-24">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
                Sequence
              </p>
              <h2 className="mt-2 text-2xl font-medium text-ink">Roadmap status</h2>
            </div>
            <Link
              to="/roadmap"
              className="hidden items-center gap-1.5 text-[14px] text-ink-dim transition-colors hover:text-ink sm:inline-flex"
            >
              Full roadmap <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {ROADMAP.map((phase) => (
              <div
                key={phase.id}
                className="rounded-2xl border border-surface-border bg-base/80 p-6 transition-all duration-300 hover:border-line/20 hover:shadow-glow-sm"
              >
                <StatusBadge status={phase.status} />
                <p className="mt-4 font-mono text-[11px] text-ink-faint">{phase.phase}</p>
                <h3 className="mt-1.5 text-[15px] font-medium text-ink">{phase.title}</h3>
              </div>
            ))}
          </div>

          <Link
            to="/roadmap"
            className="mt-8 inline-flex items-center gap-1.5 text-[14px] text-ink-dim hover:text-ink sm:hidden"
          >
            Full roadmap <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-page py-24">
        <div className="relative overflow-hidden rounded-3xl border border-surface-border bg-surface/40 p-12 text-center sm:p-16">
          <div className="pointer-events-none absolute inset-0 card-glow" aria-hidden="true" />
          <div className="relative">
            <h2 className="text-2xl font-medium text-ink sm:text-3xl">
              Read the documentation before anything else.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[15px] text-ink-dim">
              The whitepaper, litepaper, and security page describe exactly what exists today and what’s still planned.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/documentation">Browse documentation</Button>
              <Button href="/security" variant="secondary">
                Security status
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
          }
          
