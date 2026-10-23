import { useState } from "react";
import { Link, NavLink as RouterNavLink } from "react-router-dom";
import { Menu, X, ExternalLink, ArrowRight } from "lucide-react";
import { PRIMARY_NAV } from "@/data/nav";
import { TOKEN_CONFIG } from "@/data/token";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-surface-border/80 bg-base/80 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between lg:h-[72px]">
        {/* Logo */}
        <Link
          to="/"
          className="group flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <img
            src="/favicon/token-icon.png"
            alt="Meridian Protocol"
            className="h-8 w-8 rounded-full ring-1 ring-line/20 transition-all duration-300 group-hover:ring-line/60 group-hover:shadow-glow-sm"
          />
          <div className="flex flex-col leading-none">
            <span className="font-display text-[15px] font-semibold tracking-wide text-ink">
              MERIDIAN
            </span>
            <span className="text-[11px] font-medium tracking-wider text-line">
              {TOKEN_CONFIG.symbol}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          {PRIMARY_NAV.map((item) => (
            <RouterNavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `relative text-[13.5px] font-medium transition-colors duration-300 ${
                  isActive
                    ? "text-ink"
                    : "text-ink-dim hover:text-ink"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-line" />
                  )}
                </>
              )}
            </RouterNavLink>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          <a href="https://meridianprotocol-officialwebsite.farhanfaiz-author.workers.dev/app/" className="inline-flex items-center gap-2 rounded-full bg-line px-5 py-2.5 text-[13px] font-semibold text-base-deep transition-all hover:bg-line-soft hover:shadow-glow-sm">
            Open Meridian App
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
          <a
            href={TOKEN_CONFIG.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface/40 px-5 py-2.5 text-[13px] font-medium text-ink transition-all duration-300 hover:border-line/40 hover:bg-surface-raised hover:shadow-glow-sm"
          >
            View Contract
            <ExternalLink className="h-3.5 w-3.5 opacity-70" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-ink transition-colors hover:bg-surface lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-surface-border bg-base/95 backdrop-blur-xl lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-4">
            {PRIMARY_NAV.map((item) => (
              <RouterNavLink
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-3 text-[15px] font-medium transition-colors ${
                    isActive
                      ? "bg-surface text-ink"
                      : "text-ink-dim hover:bg-surface/50 hover:text-ink"
                  }`
                }
              >
                {item.label}
              </RouterNavLink>
            ))}

            <a href="https://meridianprotocol-officialwebsite.farhanfaiz-author.workers.dev/app/" onClick={() => setOpen(false)} className="mt-3 flex items-center justify-center gap-2 rounded-full bg-line px-4 py-3 text-[14px] font-semibold text-base-deep">
              Open Meridian App
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href={TOKEN_CONFIG.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 rounded-full border border-surface-border bg-surface/50 px-4 py-3 text-[14px] font-medium text-ink"
            >
              View Contract
              <ExternalLink className="h-4 w-4 opacity-70" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
          }
      
