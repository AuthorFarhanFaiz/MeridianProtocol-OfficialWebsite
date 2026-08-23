import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { FAQ_ITEMS } from "@/data/faq";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div>
      <section className="border-b border-surface-border">
        <div className="container-page py-16 sm:py-20">
          <div className="mx-auto max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              Questions
            </p>
            <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              FAQ
            </h1>
            <p className="mt-5 text-[15px] leading-relaxed text-ink-dim">
              Direct answers about what exists today. For full detail, see
              Documentation and the Risk Disclosure.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="container-page py-12 sm:py-16">
          <div className="mx-auto max-w-2xl">
            <div className="divide-y divide-surface-border overflow-hidden rounded-2xl border border-surface-border">
              {FAQ_ITEMS.map((item, i) => {
                const open = openIndex === i;
                return (
                  <div key={item.q} className="bg-base/40">
                    <button
                      onClick={() => setOpenIndex(open ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition hover:bg-surface/30"
                      aria-expanded={open}
                    >
                      <span className="text-[14.5px] font-medium text-ink">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-line transition-transform duration-300 ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className="grid transition-all duration-300 ease-out"
                      style={{
                        gridTemplateRows: open ? "1fr" : "0fr",
                        opacity: open ? 1 : 0,
                      }}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-5 text-[14px] leading-relaxed text-ink-dim">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-10 text-center text-[13.5px] text-ink-faint">
              Still unclear?{" "}
              <Link to="/documentation" className="underline underline-offset-2 hover:text-ink">
                Documentation
              </Link>
              {" · "}
              <Link to="/risk-disclosure" className="underline underline-offset-2 hover:text-ink">
                Risk Disclosure
              </Link>
              {" · "}
              <Link to="/contact" className="underline underline-offset-2 hover:text-ink">
                Contact
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
