import type { ReactNode } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export type PiLegalSection = {
  heading: string;
  paragraphs: ReactNode[];
};

export default function PiLegalPage({
  title,
  summary,
  sections,
  otherPage,
}: {
  title: string;
  summary: string;
  sections: PiLegalSection[];
  otherPage: { label: string; href: string };
}) {
  return (
    <article aria-labelledby="pi-legal-title">
      <section className="border-b border-surface-border">
        <div className="container-page py-10 sm:py-14">
          <div className="mx-auto max-w-3xl">
            <Link
              to="/pi"
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-surface-border px-4 py-2 text-[13px] text-ink-dim transition hover:border-line/40 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Pi overview
            </Link>
            <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.16em] text-line">
              Meridian Protocol · Pi Testnet
            </p>
            <h1
              id="pi-legal-title"
              className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl"
            >
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-ink-dim">
              {summary}
            </p>
            <div className="mt-6 rounded-xl border border-status-progress/30 bg-status-progress/10 p-4 text-[12.5px] leading-relaxed text-ink-dim">
              Draft for owner and qualified legal review. Prepared 14 November 2026; effective when approved and published. Provider-side settings and retention noted below must be confirmed before publication.
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container-page py-10 sm:py-14">
          <div className="mx-auto max-w-3xl space-y-9">
            {sections.map((section, index) => (
              <section
                key={section.heading}
                aria-labelledby={`pi-legal-section-${index}`}
                className="border-b border-surface-border pb-8 last:border-0 last:pb-0"
              >
                <h2
                  id={`pi-legal-section-${index}`}
                  className="text-[16px] font-medium text-ink sm:text-[17px]"
                >
                  {section.heading}
                </h2>
                <div className="mt-3 space-y-3 text-[13.5px] leading-7 text-ink-dim sm:text-[14px]">
                  {section.paragraphs.map((paragraph, paragraphIndex) => (
                    <p key={paragraphIndex}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}

            <nav
              aria-label="Pi Testnet legal pages"
              className="flex flex-col gap-3 border-t border-surface-border pt-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <Link
                to={otherPage.href}
                className="inline-flex min-h-11 items-center gap-2 text-[13px] text-line underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line"
              >
                {otherPage.label}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/pi"
                className="inline-flex min-h-11 items-center gap-2 text-[13px] text-ink-dim underline-offset-4 hover:text-ink hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Return to Meridian on Pi
              </Link>
            </nav>
          </div>
        </div>
      </section>
    </article>
  );
}
