import { useState } from "react";
import { Mail, Send, CheckCircle2 } from "lucide-react";
import { SITE_CONFIG } from "@/data/token";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Frontend only for now — later you can connect Formspree / Cloudflare Worker / email API
    const mailto = `mailto:${SITE_CONFIG.contactEmail}?subject=${encodeURIComponent(
      form.subject || "Meridian Protocol Inquiry"
    )}&body=${encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    )}`;
    window.location.href = mailto;
    setSubmitted(true);
  };

  return (
    <div>
      {/* Header */}
      <section className="border-b border-surface-border">
        <div className="container-page py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              Contact
            </p>
            <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Get in touch
            </h1>
            <p className="mt-5 text-[15.5px] leading-relaxed text-ink-dim">
              Official communication channel for Meridian Protocol.
            </p>
          </div>
        </div>
      </section>

      {/* Email Card */}
      <section className="border-b border-surface-border">
        <div className="container-page py-12">
          <div className="mx-auto max-w-xl">
            <div className="relative overflow-hidden rounded-2xl border border-surface-border bg-surface/40 p-8 text-center">
              <div className="pointer-events-none absolute inset-0 card-glow" aria-hidden="true" />
              <div className="relative flex flex-col items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-line/20 bg-line/10 transition-transform duration-300 hover:scale-110">
                <Mail className="h-5 w-5 text-line" />
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-faint">
                  Official Email
                </p>
                <a
                  href={`mailto:${SITE_CONFIG.contactEmail}`}
                  className="mt-2 block font-mono text-[16px] text-ink transition-colors hover:text-line"
                >
                  {SITE_CONFIG.contactEmail}
                </a>
              </div>
              <p className="max-w-sm text-[13px] leading-relaxed text-ink-faint">
                This is the only official contact email. Use this exact address
                anywhere you list or submit the project.
              </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section>
        <div className="container-page py-16">
          <div className="mx-auto max-w-xl">
            <p className="text-center font-mono text-[11px] uppercase tracking-[0.15em] text-line">
              Message
            </p>
            <h2 className="mt-2 text-center text-xl font-medium text-ink">
              Send a message
            </h2>

            {submitted ? (
              <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-status-live/30 bg-status-live/10 p-10 text-center">
                <CheckCircle2 className="h-8 w-8 text-status-live" />
                <p className="text-[15px] text-ink">
                  Your email client should open. If it doesn’t, write to us
                  directly at {SITE_CONFIG.contactEmail}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-10 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full rounded-xl border border-surface-border bg-surface/40 px-4 py-3 text-[14px] text-ink outline-none transition focus:border-line/40"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full rounded-xl border border-surface-border bg-surface/40 px-4 py-3 text-[14px] text-ink outline-none transition focus:border-line/40"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) =>
                      setForm({ ...form, subject: e.target.value })
                    }
                    className="w-full rounded-xl border border-surface-border bg-surface/40 px-4 py-3 text-[14px] text-ink outline-none transition focus:border-line/40"
                    placeholder="Partnership / Support / General"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className="w-full resize-none rounded-xl border border-surface-border bg-surface/40 px-4 py-3 text-[14px] text-ink outline-none transition focus:border-line/40"
                    placeholder="Write your message..."
                  />
                </div>

                <button
                  type="submit"
                  className="shine-sweep inline-flex w-full items-center justify-center gap-2 rounded-full bg-line px-6 py-3.5 text-[14px] font-semibold text-base-deep transition-all hover:bg-line-soft hover:shadow-glow-sm"
                >
                  Send Message
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}

            <p className="mt-8 text-center text-[12.5px] leading-relaxed text-ink-faint">
              Meridian Protocol will never DM you first or request your seed
              phrase / private key. Always verify official channels.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
                  }
                    
