import { Link } from "react-router-dom";
import { TOKEN_CONFIG, SITE_CONFIG } from "@/data/token";
import { FOOTER_NAV } from "@/data/nav";
import { truncateAddress } from "@/lib/format";

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-faint">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            {l.href.startsWith("http") ? (
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13.5px] text-ink-dim transition-colors duration-300 hover:text-ink"
              >
                {l.label}
              </a>
            ) : (
              <Link
                to={l.href}
                className="text-[13.5px] text-ink-dim transition-colors duration-300 hover:text-ink"
              >
                {l.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-base-deep">
      <div className="container-page py-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-6">
          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <img
                src="/favicon/token-icon.png"
                alt="Meridian Protocol"
                className="h-7 w-7 rounded-full ring-1 ring-line/20"
              />
              <span className="font-display text-[14px] font-medium tracking-wide text-ink">
                MERIDIAN PROTOCOL
              </span>
            </div>

            <p className="mt-4 font-mono text-[11px] tracking-wide text-ink-faint">
              {TOKEN_CONFIG.symbol} · {TOKEN_CONFIG.chain}
            </p>
            <p
              className="mt-1 break-all font-mono text-[11px] text-ink-faint"
              title={TOKEN_CONFIG.contractAddress}
            >
              {truncateAddress(TOKEN_CONFIG.contractAddress)}
            </p>
          </div>

          <FooterColumn title="Protocol" links={FOOTER_NAV.protocol} />
          <FooterColumn title="Resources" links={FOOTER_NAV.resources} />
          <FooterColumn title="Trust" links={FOOTER_NAV.trust} />
          <FooterColumn title="Community" links={FOOTER_NAV.community} />
          <FooterColumn title="Legal" links={FOOTER_NAV.legal} />
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 flex flex-col gap-4 border-t border-surface-border pt-8 text-[12px] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Meridian Protocol. All rights reserved.</p>
          <p className="font-mono text-[11px] uppercase tracking-wider">
            {SITE_CONFIG.domain} · Fixed Supply · Not a solicitation
          </p>
        </div>

        {/* Security Notice */}
        <p className="mt-6 max-w-3xl text-[12px] leading-relaxed text-ink-faint">
          Meridian Protocol will never DM you first or request your seed phrase,
          private key, or wallet password. Always verify the contract address
          against the{" "}
          <Link
            to="/official-links"
            className="underline underline-offset-2 transition-colors hover:text-ink"
          >
            Official Links Registry
          </Link>{" "}
          before interacting with MRDN.
        </p>
      </div>
    </footer>
  );
}
