import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

type ConsentValue = "accepted" | "rejected" | "custom" | null;

const STORAGE_KEY = "mrdn_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ConsentValue;
      if (!saved) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const save = (value: ConsentValue, analyticsEnabled = false) => {
    try {
      localStorage.setItem(STORAGE_KEY, value || "rejected");
      localStorage.setItem(
        "mrdn_analytics_consent",
        analyticsEnabled ? "1" : "0"
      );
    } catch {
      // ignore
    }
    setVisible(false);
    setManageOpen(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-surface-border bg-base/95 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
        {!manageOpen ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
                  Cookies
                </p>
                <h2 className="mt-1 text-[16px] font-medium text-ink">
                  We value your privacy
                </h2>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-dim">
                  Meridian Protocol does not use advertising cookies. We only use
                  essential technical storage needed for the site to work (for
                  example remembering this choice). Optional analytics are off by
                  default.{" "}
                  <Link
                    to="/cookie-policy"
                    className="underline underline-offset-2 hover:text-ink"
                  >
                    Cookie Policy
                  </Link>
                  .
                </p>
              </div>
              <button
                onClick={() => save("rejected", false)}
                className="rounded-lg p-1 text-ink-faint hover:text-ink"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                onClick={() => setManageOpen(true)}
                className="rounded-full border border-surface-border px-5 py-2.5 text-[13px] font-medium text-ink-dim transition hover:text-ink"
              >
                Manage
              </button>
              <button
                onClick={() => save("rejected", false)}
                className="rounded-full border border-surface-border px-5 py-2.5 text-[13px] font-medium text-ink-dim transition hover:text-ink"
              >
                Reject
              </button>
              <button
                onClick={() => save("accepted", true)}
                className="rounded-full bg-line px-5 py-2.5 text-[13px] font-semibold text-base-deep transition hover:bg-line-soft"
              >
                Accept
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              Manage preferences
            </p>
            <h2 className="mt-1 text-[16px] font-medium text-ink">
              Cookie settings
            </h2>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-surface-border bg-surface/30 px-4 py-3">
                <div>
                  <p className="text-[14px] font-medium text-ink">Essential</p>
                  <p className="text-[12.5px] text-ink-faint">
                    Required for the site to function. Always on.
                  </p>
                </div>
                <span className="font-mono text-[11px] text-status-live">ON</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-surface-border bg-surface/30 px-4 py-3">
                <div>
                  <p className="text-[14px] font-medium text-ink">Analytics</p>
                  <p className="text-[12.5px] text-ink-faint">
                    Optional. Currently not used on this site. Preference saved
                    for future use.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAnalytics((v) => !v)}
                  className={`relative h-6 w-11 rounded-full transition ${
                    analytics ? "bg-line" : "bg-surface-border"
                  }`}
                  aria-pressed={analytics}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                      analytics ? "left-5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                onClick={() => setManageOpen(false)}
                className="rounded-full border border-surface-border px-5 py-2.5 text-[13px] font-medium text-ink-dim"
              >
                Back
              </button>
              <button
                onClick={() => save("custom", analytics)}
                className="rounded-full bg-line px-5 py-2.5 text-[13px] font-semibold text-base-deep"
              >
                Save preferences
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
              }
