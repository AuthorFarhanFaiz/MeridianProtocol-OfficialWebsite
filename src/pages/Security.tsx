import {
  SECURITY_ITEMS,
  CONTRACT_ADMIN_SURFACE,
  SEED_PHRASE_WARNING,
} from "@/data/security";
import StatusBadge from "@/components/StatusBadge";
import { ShieldAlert } from "lucide-react";

export default function Security() {
  return (
    <div>
      {/* Header */}
      <section className="border-b border-surface-border">
        <div className="container-page py-16 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              Trust Status
            </p>
            <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Security & Legal Status
            </h1>
            <p className="mt-5 max-w-2xl text-[15.5px] leading-relaxed text-ink-dim">
              This page is updated only when real work is completed. Nothing is
              presented as done until it actually is.
            </p>
          </div>
        </div>
      </section>

      {/* Security Items */}
      <section className="border-b border-surface-border">
        <div className="container-page py-14">
          <div className="mx-auto max-w-3xl space-y-5">
            {SECURITY_ITEMS.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-surface-border bg-surface/30 p-6"
              >
                <StatusBadge
                  status={item.status}
                  tone={
                    item.status.includes("VERIFIED") ||
                    item.status.includes("COMPLETED")
                      ? "live"
                      : item.status.includes("NOT YET")
                      ? "danger"
                      : "planned"
                  }
                />
                <h2 className="mt-4 text-[16px] font-medium text-ink">
                  {item.title}
                </h2>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-dim">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admin Surface */}
      <section className="border-b border-surface-border bg-surface/10">
        <div className="container-page py-14">
          <div className="mx-auto max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              Design
            </p>
            <h2 className="mt-2 text-xl font-medium text-ink">
              Contract Admin Surface
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-ink-dim">
              {CONTRACT_ADMIN_SURFACE}
            </p>
          </div>
        </div>
      </section>

      {/* Warning */}
      <section>
        <div className="container-page py-14">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-start gap-4 rounded-2xl border border-status-danger/30 bg-status-danger/10 p-6">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-status-danger" />
              <p className="text-[14px] leading-relaxed text-ink">
                {SEED_PHRASE_WARNING}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
