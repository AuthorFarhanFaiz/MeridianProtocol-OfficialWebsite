import { SITE_CONFIG } from "@/data/token";
import PiLegalPage, { type PiLegalSection } from "./PiLegalPage";

const sections: PiLegalSection[] = [
  {
    heading: "1. Scope",
    paragraphs: [
      "This policy applies to the Meridian Protocol Pi Testnet experience at testnet.meridianprotocol.site/pi and its Pi-specific legal pages. It describes the Pi identity and read-only MRDN information features. Pi Network, BNB Smart Chain, and their providers operate independently under their own policies. This policy does not replace the privacy terms for other Meridian websites or the Android account app.",
    ],
  },
  {
    heading: "2. Pi identity and authentication",
    paragraphs: [
      "If you choose Pi sign-in, the Pi SDK's Pi.authenticate method requests the username scope only. The SDK returns a temporary access token; the page sends that token in a same-origin request to the Meridian Testnet Worker. The Worker verifies it with Pi's official GET /v2/me endpoint and returns only the verified Pi UID and username.",
      "The temporary access token and verified identity are not written to localStorage, sessionStorage, or an application database. The verified identity is held in page memory and is cleared when the page is refreshed or you clear its display state. The Worker source contains no application log statement that records the access token. Pi, Pi Browser, and Cloudflare may process request data under their own systems and policies.",
    ],
  },
  {
    heading: "3. Public BNB Smart Chain information",
    paragraphs: [
      "The dashboard makes read-only eth_call requests for public information from the listed MRDN token, staking, vesting, and treasury contracts. It does not submit transactions or send your Pi identity, wallet address, or access token to the BNB RPC endpoints. Values come from public BNB Smart Chain state and can be delayed, incomplete, or unavailable.",
      "The Worker may use these configured BNB RPC endpoints: bsc-dataseed.bnbchain.org, bsc-dataseed-public.bnbchain.org, bsc-dataseed.nariox.org, bsc-dataseed.defibit.io, bsc-dataseed.ninicoin.io, and rpc-bnb.blockmachine.io. Public blockchain records are visible on the network and are not controlled or removable by Meridian.",
    ],
  },
  {
    heading: "4. Providers and information sharing",
    paragraphs: [
      "The Pi SDK is loaded from sdk.minepi.com, and identity verification is requested from api.minepi.com. Cloudflare Workers host this Testnet experience and provide the configured per-IP rate limiter. For the Pi authentication and transparency endpoints, the Worker uses the connecting IP address supplied by Cloudflare to form a rate-limit key. The page links to BscScan for public contract verification; BscScan receives a request from your browser only if you choose to open one of those links.",
      "The Pi routes do not display the Meridian Guide chat widget. The site loads its display fonts from Google Fonts (fonts.googleapis.com and fonts.gstatic.com). The reviewed Pi source contains no advertising or analytics integration. External providers may process standard connection metadata when your browser contacts them.",
      "The site loads its display fonts from Google Fonts (fonts.googleapis.com and fonts.gstatic.com). The reviewed Pi source contains no advertising or analytics integration. External providers may process standard connection metadata when your browser contacts them.",
    ],
  },
  {
    heading: "5. Browser storage, cookies, and logs",
    paragraphs: [
      "The Pi routes do not use application localStorage or sessionStorage for Pi authentication. The temporary Pi access token and verified identity remain in page memory only. The cookie-consent component exists in the repository but is not mounted by the current website layout. Cloudflare challenge/security settings or Pi Browser may use provider-managed cookies or other browser storage; their current behavior was not confirmed in the source review. The Pi Testnet Wrangler file does not specify application log sampling or a retention period. Cloudflare dashboard log settings and retention, as well as Pi, RPC, and Google Fonts retention, require confirmation from the relevant provider settings and policies.",
    ],
  },
  {
    heading: "6. Retention and security",
    paragraphs: [
      "The reviewed Worker verifies the temporary Pi token during the request and does not write the token or returned identity to a database. The frontend keeps the displayed identity in memory only. The rate limiter processes request IP information to apply its configured request limits. The code does not establish a Meridian retention period for provider infrastructure logs or provider-held records, so no specific retention period can be promised here.",
      "The app uses HTTPS and limits Pi authentication to the username scope. These measures reduce exposure but cannot guarantee absolute security. Do not share credentials or signing secrets with Meridian support or the Guide.",
    ],
  },
  {
    heading: "7. Your questions and requests",
    paragraphs: [
      <>
        For privacy questions or requests about information handled by Meridian, contact{" "}
        <a className="text-line underline underline-offset-4" href={`mailto:${SITE_CONFIG.contactEmail}`}>
          {SITE_CONFIG.contactEmail}
        </a>
        . The app does not keep a Pi identity profile in its database. Information held by Pi, Cloudflare, an RPC provider, Google, or OpenRouter is subject to that provider's own processes and policies.
      </>,
    ],
  },
  {
    heading: "8. Updates and effective date",
    paragraphs: [
      "This draft describes the source reviewed on 14 November 2026. It becomes effective when approved and published. We may update it if the Pi experience or its providers change. The version and effective date should be updated when a revised policy is published.",
    ],
  },
];

export default function PiPrivacyPolicy() {
  return (
    <PiLegalPage
      title="Pi Testnet Privacy Policy"
      summary="How the separate Meridian Protocol Pi Testnet experience handles authentication, public MRDN data, and related provider requests."
      sections={sections}
      otherPage={{ label: "Read the Pi Testnet Terms of Service", href: "/pi/terms" }}
    />
  );
}
