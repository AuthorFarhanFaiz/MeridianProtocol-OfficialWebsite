import { ROADMAP } from "@/data/roadmap";
import StatusBadge from "@/components/StatusBadge";

export default function Roadmap() {
  return (
    <div>
      {/* Header */}
      <section className="border-b border-surface-border">
        <div className="container-page py-16 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              Sequence
            </p>
            <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Roadmap
            </h1>
            <p className="mt-5 max-w-2xl text-[15.5px] leading-relaxed text-ink-dim">
              Status reflects reality, not intent. A phase is only marked
              completed when it is actually completed.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section>
        <div className="container-page py-16 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="relative space-y-12 border-l border-surface-border pl-8 sm:pl-10">
              {ROADMAP.map((phase) => (
                <div key={phase.id} className="relative">
                  {/* Dot */}
                  <span
                    className={`absolute -left-[41px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-base sm:-left-[49px] ${
                      phase.status === "COMPLETED"
                        ? "bg-status-live"
                        : phase.status === "IN PROGRESS"
                        ? "bg-status-progress"
                        : "bg-line/40"
                    }`}
                  />

                  <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-faint">
                    {phase.phase}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <h2 className="text-[18px] font-medium text-ink">
                      {phase.title}
                    </h2>
                    <StatusBadge
                      status={phase.status}
                      tone={
                        phase.status === "COMPLETED"
                          ? "live"
                          : phase.status === "IN PROGRESS"
                          ? "progress"
                          : "planned"
                      }
                    />
                  </div>

                  <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-ink-dim">
                    {phase.description}
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
