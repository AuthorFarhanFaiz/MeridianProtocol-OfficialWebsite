import { Download, ExternalLink, FileText } from "lucide-react";
import { Link } from "react-router-dom";

interface DocPageProps {
  eyebrow: string;
  title: string;
  pages: number;
  updated: string;
  href: string;
}

export default function DocumentPage({
  eyebrow,
  title,
  pages,
  updated,
  href,
}: DocPageProps) {
  return (
    <div>
      <section className="border-b border-surface-border">
        <div className="container-page py-16 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              {eyebrow}
            </p>

            <div className="mt-3 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
                  {title}
                </h1>
                <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-ink-dim">
                  Official project documentation. Verify on-chain facts independently
                  on BscScan. This is not a solicitation to buy tokens.
                </p>
                <p className="mt-3 font-mono text-[12px] text-ink-faint">
                  v1.1 · {pages} pages · Updated {updated}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                <a
                  href={href}
                  download
                  className="inline-flex items-center gap-1.5 rounded-md border border-surface-border px-4 py-2.5 text-[13px] text-ink transition hover:border-line/50"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download PDF
                </a>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md bg-line px-4 py-2.5 text-[13px] font-semibold text-base-deep transition hover:bg-line-soft"
                >
                  Open PDF
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-surface-border bg-surface/10">
        <div className="container-page py-10">
          <div className="mx-auto max-w-3xl">
            <div className="overflow-hidden rounded-2xl border border-surface-border bg-base shadow-sm">
              <div className="flex items-center gap-2 border-b border-surface-border px-4 py-3">
                <FileText className="h-4 w-4 text-line" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                  PDF preview
                </span>
              </div>
              <div className="h-[75vh] w-full bg-surface/20">
                <iframe
                  title={title}
                  src={href}
                  className="h-full w-full"
                  loading="lazy"
                />
              </div>
            </div>

            <p className="mt-4 text-center text-[12.5px] text-ink-faint">
              If the preview does not load, use{" "}
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-ink"
              >
                Open PDF
              </a>{" "}
              or Download.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 text-[13.5px] text-ink-dim">
              <Link
                to="/documentation"
                className="underline underline-offset-2 hover:text-ink"
              >
                ← Documentation index
              </Link>
              <Link
                to={
                  title.toLowerCase().includes("white")
                    ? "/litepaper"
                    : "/whitepaper"
                }
                className="underline underline-offset-2 hover:text-ink"
              >
                {title.toLowerCase().includes("white")
                  ? "Read Litepaper →"
                  : "Read Whitepaper →"}
              </Link>
              <Link
                to="/security"
                className="underline underline-offset-2 hover:text-ink"
              >
                Security status
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
