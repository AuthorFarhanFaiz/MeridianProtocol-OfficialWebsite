import { SITE_CONFIG } from "@/data/token";
import PiLegalPage, { type PiLegalSection } from "./PiLegalPage";

const sections: PiLegalSection[] = [
  {
    heading: "1. Scope and acceptance",
    paragraphs: [
      "These terms apply only to the Meridian Protocol Pi Testnet experience at testnet.meridianprotocol.site/pi and its Pi-specific legal pages. By using that experience, you agree to these terms. If you do not agree, stop using it. Other Meridian services may have separate terms.",
    ],
  },
  {
    heading: "2. Separate networks; no Pi endorsement",
    paragraphs: [
      "Pi Network is used in this experience for Testnet identity authentication only. MRDN remains a token on BNB Smart Chain; this service does not create or represent MRDN as a Pi Network token. The names and marks of Pi Network identify the third-party service used for authentication. Meridian does not claim that Pi Network endorses, sponsors, or is affiliated with Meridian Protocol.",
    ],
  },
  {
    heading: "3. Informational and read-only service",
    paragraphs: [
      "The Pi page provides Pi username authentication and read-only display of public MRDN contract information from BNB Smart Chain. Pi sign-in verifies identity only; it does not create a BNB wallet session, connect a wallet, authorize a transaction, or give Meridian custody or control of assets.",
      "This experience does not implement Pi payments, Pi deposits or withdrawals, MRDN purchases or sales, swaps, bridges, or token transfers. Do not use the Pi login as authorization for any financial transaction.",
    ],
  },
  {
    heading: "4. No financial promises or advice",
    paragraphs: [
      "The dashboard is informational. It does not promise staking returns, rewards, price appreciation, liquidity, or exchange listings, and it is not financial, investment, tax, or legal advice. Displayed contract data may be delayed, incomplete, or unavailable. No decision should rely solely on this page.",
      "You are responsible for independently checking contract addresses, network selection, source information, and transactions through trusted public sources before taking any action elsewhere.",
    ],
  },
  {
    heading: "5. Third-party services and blockchain risks",
    paragraphs: [
      "Pi Network, Cloudflare, BNB Smart Chain RPC providers, Google Fonts, and BscScan (if you open an explorer link) are third-party services. Their availability, terms, privacy practices, and security are outside Meridian's control. Use of Pi authentication is also subject to the Pi service's applicable terms.",
      "Blockchain networks and public RPC services can be delayed, interrupted, or return incomplete data. Public blockchain records can be permanent and visible to others. This Pi experience does not submit transactions, but actions you take in another wallet or service are your responsibility and may be irreversible.",
    ],
  },
  {
    heading: "6. Acceptable use",
    paragraphs: [
      "Use this experience lawfully and do not attempt to access another person's Pi identity or data, interfere with the service, bypass its rate limits or security controls, overload its endpoints, or use it to distribute malware, spam, or misleading content. Do not send passwords, recovery codes, private keys, or seed phrases to Meridian support.",
    ],
  },
  {
    heading: "7. Availability and changes",
    paragraphs: [
      "The Pi Testnet experience may change, be interrupted, or be discontinued, including because of Testnet, Pi Browser, Cloudflare, RPC provider, or maintenance issues. Meridian may update these terms when the service changes. The current version and effective date will be shown on this page after owner approval and publication.",
    ],
  },
  {
    heading: "8. Disclaimers and liability",
    paragraphs: [
      "To the extent permitted by applicable law, the experience is provided on an as-available basis without a promise of uninterrupted service, error-free data, or absolute security. To the extent permitted by law, Meridian is not responsible for losses caused by provider outages, delayed or incorrect public network data, user-controlled devices, or actions taken outside this read-only Pi experience. Nothing in these terms excludes a right or liability that cannot lawfully be excluded or limited.",
    ],
  },
  {
    heading: "9. Governing law and contact",
    paragraphs: [
      "These Pi-specific draft terms do not designate governing law, court, or venue. The existing website terms leave those choices pending qualified legal review; confirm the applicable clause before treating these Pi terms as final.",
      <>
        For questions about these terms, contact{" "}
        <a className="text-line underline underline-offset-4" href={`mailto:${SITE_CONFIG.contactEmail}`}>
          {SITE_CONFIG.contactEmail}
        </a>
        .
      </>,
    ],
  },
];

export default function PiTermsOfService() {
  return (
    <PiLegalPage
      title="Pi Testnet Terms of Service"
      summary="Terms for using Meridian Protocol's separate Pi Testnet identity and read-only transparency experience."
      sections={sections}
      otherPage={{ label: "Read the Pi Testnet Privacy Policy", href: "/pi/privacy" }}
    />
  );
}
