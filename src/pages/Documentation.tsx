import { Link } from "react-router-dom";
import { ArrowRight, FileText, BookOpen } from "lucide-react";
import { DOCUMENTS } from "@/data/token";

const DOC_LINKS = [
  { num: "01", title: "Introduction", href: "/about", desc: "What Meridian is and current project status." },
  { num: "02", title: "Architecture", href: "/technology", desc: "Current and future technical architecture." },
  { num: "03", title: "MRDN Token", href: "/token", desc: "Contract facts, supply, and on-chain verification." },
  { num: "04", title: "Staking", href: "/staking", desc: "How staking works and current security status." },
  { num: "05", title: "Tokenomics", href: "/tokenomics", desc: "Allocation framework and supply mechanics." },
  { num: "06", title: "Security", href: "/security", desc: "Verification status, audit status, admin surface." },
  { num: "07", title: "Roadmap", href: "/roadmap", desc: "Phase-by-phase sequence and real status." },
  { num: "08", title: "Transparency", href: "/transparency", desc: "What can be verified independently today." },
  { num: "09", title: "Official Links", href: "/official-links", desc: "Only registry of official channels and contracts." },
  { num: "10", title: "FAQ", href: "/faq", desc: "Common questions, answered directly." },
  { num: "11", title: "Developers", href: "/developers", desc: "Source, contracts, and contribution resources." },
  { num: "12", title: "Legal", href: "/legal", desc: "Terms, privacy, risk disclosure, and disclaimers." },
];

export default function Documentation() {
  return (
    <div>
      {/* Header */}
      <section className="border-b border-surface-border">
        <div className="container-page py-16 sm:py-20">
          <div className="mx-auto max-w-4xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              Documentation
            </p>
            <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Everything, in one place
            </h1>
            <p className="mt-5 max-w-2xl text-[15.5px] leading-relaxed text-ink-dim">
              Every claim on this site traces back to a page here. The whitepaper
              and litepaper sit at the center — the pages below are the expanded,
              always-current version of the same facts.
            </p>
          </div>
        </div>
      </section>

      {/* Primary docs */}
      <section className="border-b border-surface-border">
        <div className="container-page py-12">
          <div className="mx-auto max-w-4xl grid gap-4 sm:grid-cols-2">
            <a
              href={DOCUMENTS.whitepaper.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-line/30 bg-line/5 p-6 transition-all duration-300 hover:border-line/50 hover:bg-line/10 hover:shadow-glow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-line/20 bg-line/10 transition-transform duration-300 group-hover:scale-110">
                <FileText className="h-4 w-4 text-line" />
              </div>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-line">
                Technical · Comprehensive
              </p>
              <p className="mt-1.5 text-[17px] font-medium text-ink">Whitepaper</p>
              <p className="mt-2 text-[13.5px] text-ink-dim">
                Full technical and economic design. PDF.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-[13px] text-line">
                Open PDF <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </span>
            </a>

            <a
              href={DOCUMENTS.litepaper.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-surface-border bg-surface/30 p-6 transition-all duration-300 hover:border-line/30 hover:bg-surface/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-surface-border bg-surface/50 transition-transform duration-300 group-hover:scale-110">
                <BookOpen className="h-4 w-4 text-ink-dim" />
              </div>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
                Executive · Overview
              </p>
              <p className="mt-1.5 text-[17px] font-medium text-ink">Litepaper</p>
              <p className="mt-2 text-[13.5px] text-ink-dim">
                Shorter overview of the protocol. PDF.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-[13px] text-ink-dim group-hover:text-ink">
                Open PDF <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Index */}
      <section>
        <div className="container-page py-14">
          <div className="mx-auto max-w-4xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              Index
            </p>
            <h2 className="mt-2 text-xl font-medium text-ink">Site documentation</h2>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {DOC_LINKS.map((doc) => (
                <Link
                  key={doc.num}
                  to={doc.href}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-surface-border bg-surface/25 p-5 transition-all hover:border-line/30 hover:bg-surface/40"
                >
                  <div className="flex items-start gap-4">
                    <span className="font-mono text-[12px] text-ink-faint">{doc.num}</span>
                    <div>
                      <p className="text-[14.5px] font-medium text-ink">{doc.title}</p>
                      <p className="mt-1 text-[13px] text-ink-dim">{doc.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-line" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
                }
                           
