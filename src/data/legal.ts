export interface LegalSection {
  heading: string;
  body: string;
}

export interface LegalDoc {
  eyebrow: string;
  title: string;
  notice?: string;
  sections: LegalSection[];
}

export const PRIVACY_POLICY: LegalDoc = {
  eyebrow: "Legal",
  title: "Privacy Policy",
  notice:
    "Draft template — pending review by qualified legal counsel for the jurisdictions you operate in (e.g. GDPR, CCPA) before publishing as final.",
  sections: [
    {
      heading: "What this site collects",
      body: "This website does not use third-party advertising trackers. If you use the contact form or email the project, the information you voluntarily provide (such as name, email, and message content) is used only to respond to you and is not sold or shared with third parties for marketing.",
    },
    {
      heading: "Standard server logs",
      body: "Your hosting provider (e.g. Cloudflare Pages) may automatically log standard technical information (such as IP address, browser type, and request time) as part of normal web server operation, independent of this site's own application code.",
    },
    {
      heading: "Contact",
      body: "If you contact the project directly (e.g. by email at admin@meridianprotocol.site), any information you provide is used only to respond to you.",
    },
    {
      heading: "On-chain data",
      body: "Blockchain transactions involving MRDN are public by nature of BNB Smart Chain and are not controlled by this website.",
    },
    {
      heading: "Changes",
      body: "This policy may be updated as the project develops. Material changes will be reflected with a new version date on this page.",
    },
  ],
};

export const TERMS_OF_USE: LegalDoc = {
  eyebrow: "Legal",
  title: "Terms & Conditions",
  notice:
    "Draft template — pending review by qualified legal counsel before publishing as final. Governing law/jurisdiction to be specified after legal review.",
  sections: [
    {
      heading: "Acceptance",
      body: "By using this website, you agree to these terms. If you do not agree, do not use the site.",
    },
    {
      heading: "No offer or solicitation",
      body: "Nothing on this site is an offer, solicitation, or recommendation to buy, sell, or hold MRDN or any other asset.",
    },
    {
      heading: "Informational content only",
      body: "Content describing MRDN's status, roadmap, and planned utility is provided for information only and may change without notice. See the Disclaimer and Risk Disclosure.",
    },
    {
      heading: "No warranty",
      body: 'This site and its content are provided "as is," without warranty of any kind, including accuracy or fitness for a particular purpose.',
    },
    {
      heading: "Limitation of liability",
      body: "To the maximum extent permitted by law, Meridian Protocol and its creator are not liable for any loss arising from use of this site or from holding, trading, or otherwise interacting with MRDN.",
    },
    {
      heading: "Intellectual property",
      body: "Site content and branding belong to their respective creator(s) and may not be reproduced without permission.",
    },
    {
      heading: "Changes to these terms",
      body: "These terms may be updated as the project develops; the version date on this page will reflect the latest revision.",
    },
  ],
};

export const RISK_DISCLOSURE: LegalDoc = {
  eyebrow: "Required reading",
  title: "Risk Disclosure",
  notice:
    "This page is not a solicitation to buy tokens. It does not promise price, yield, listing, or return. Read this in full before deciding anything about MRDN.",
  sections: [
    {
      heading: "No guaranteed value",
      body: "MRDN has no guaranteed price, liquidity, listing, yield, or return. Token value can go to zero. Past activity, roadmap items, or documentation do not create any promise of profit.",
    },
    {
      heading: "Market risk",
      body: "MRDN may have no active public market. If a market forms, price may be highly volatile and could fall to zero.",
    },
    {
      heading: "Liquidity risk",
      body: "No public trading liquidity has been deployed as of this writing. Any future liquidity may be limited, concentrated, or withdrawn.",
    },
    {
      heading: "Smart contract & technology risk",
      body: "Smart contracts may contain bugs or unexpected behavior. Source code is verified on BscScan and automated scans have been run, but an independent professional manual audit has not been completed for Meridian contracts as of this writing. Use of the token, staking, vesting, treasury, or any related contract is at your own risk.",
    },
    {
      heading: "Blockchain & network risk",
      body: "BNB Smart Chain may experience congestion, outages, reorgs, or fee changes. Transactions can fail, be delayed, or become costly. Meridian Protocol does not control the underlying network.",
    },
    {
      heading: "Regulatory risk",
      body: "No formal legal or securities-classification opinion has been obtained for MRDN in any jurisdiction. Regulatory treatment can change and may restrict trading or use where you live. You are solely responsible for legality in your jurisdiction.",
    },
    {
      heading: "Utility & development risk",
      body: "Some features (for example staking) are live on-chain; others remain planned or in development. Planned items may be delayed, changed, or never delivered. Always check status labels and on-chain evidence rather than assumptions.",
    },
    {
      heading: "Operational risk",
      body: "Meridian is developed by a small independent team. Development may slow, change direction, or stop. Rely on verifiable on-chain facts, not marketing claims.",
    },
    {
      heading: "Security practices",
      body: "Meridian Protocol will never request your seed phrase, private key, or wallet password. Always verify contract addresses against the Official Links Registry before interacting.",
    },
    {
      heading: "Acceptance",
      body: "If you do not accept these risks, do not interact with MRDN or any related smart contract.",
    },
  ],
};

export const DISCLAIMER: LegalDoc = {
  eyebrow: "Legal",
  title: "Disclaimer",
  notice:
    "General informational disclaimer. This is not a substitute for advice from qualified legal counsel in your jurisdiction.",
  sections: [
    {
      heading: "No financial advice",
      body: "Nothing on this website constitutes financial, investment, tax, or legal advice. You are solely responsible for any decisions you make regarding MRDN or any other asset.",
    },
    {
      heading: "No offer or solicitation",
      body: "Nothing on this site is an offer, solicitation, or recommendation to buy, sell, or hold MRDN or any other asset in any jurisdiction.",
    },
    {
      heading: "No guarantee of value, listing, or liquidity",
      body: "Meridian Protocol makes no representation or guarantee about the future price, trading availability, exchange listing, or liquidity of MRDN.",
    },
    {
      heading: "Forward-looking statements",
      body: "Statements about planned utility, roadmap phases, or future features are intentions, not commitments with guaranteed timelines or outcomes. They may change or not materialize. Status labels (Live, In Progress, Planned) reflect the project’s best understanding at the time of publication.",
    },
    {
      heading: "No warranty",
      body: 'This site and its content are provided "as is," without warranty of any kind, including accuracy, completeness, or fitness for a particular purpose.',
    },
    {
      heading: "Limitation of liability",
      body: "To the maximum extent permitted by law, Meridian Protocol and its contributors are not liable for any loss arising from use of this site or from holding, trading, or otherwise interacting with MRDN or related smart contracts.",
    },
    {
      heading: "Jurisdictional availability",
      body: "Digital assets may be restricted or prohibited in certain jurisdictions. It is your responsibility to determine whether interacting with MRDN is lawful where you are located.",
    },
    {
      heading: "No endorsement by BNB Chain or Binance",
      body: "Deployment on BNB Smart Chain does not mean Binance or the BNB Chain organization has invested in, approved, endorsed, or reviewed Meridian Protocol.",
    },
    {
      heading: "Official channels only",
      body: "Verify all contract addresses and links against the Official Links Registry before interacting. Meridian Protocol will never DM you first or request your seed phrase or private key.",
    },
    {
      heading: "High risk",
      body: "Cryptocurrency assets, including tokens without a completed independent manual audit, carry significant risk, including total loss of value. See the full Risk Disclosure.",
    },
  ],
};

export const ACCEPTABLE_USE: LegalDoc = {
  eyebrow: "Community",
  title: "Acceptable Use Policy",
  notice:
    "Draft — defines prohibited activity across all official Meridian channels and this website.",
  sections: [
    {
      heading: "Prohibited: fraud & deception",
      body: "Using Meridian's name, brand, or channels to defraud, deceive, or mislead others is strictly prohibited.",
    },
    {
      heading: "Prohibited: phishing & impersonation",
      body: "Creating fake accounts, cloned channels, or lookalike domains impersonating Meridian Protocol is prohibited and will be reported where possible.",
    },
    {
      heading: "Prohibited: malware & exploits",
      body: "Distributing malware, exploit code, or attempting unauthorized access to any Meridian system is prohibited.",
    },
    {
      heading: "Prohibited: market manipulation",
      body: "Coordinated manipulation, wash trading, or deceptive promotional schemes involving MRDN are not endorsed and are strictly the responsibility of whoever conducts them — not Meridian Protocol.",
    },
    {
      heading: "Prohibited: illegal activity",
      body: "Using MRDN or Meridian's channels for any illegal purpose under applicable law is prohibited.",
    },
    {
      heading: "Enforcement",
      body: "Meridian may restrict access to its own channels for violations. It cannot control third-party platforms, exchanges, or wallets.",
    },
  ],
};

export const INTELLECTUAL_PROPERTY: LegalDoc = {
  eyebrow: "Corporate & IP",
  title: "Intellectual Property & Copyright Policy",
  notice:
    "In review — pending external legal review before this is treated as a finalized IP policy.",
  sections: [
    {
      heading: "Meridian branding & logo",
      body: "The Meridian Protocol name, wordmark, and MRDN coin logo are the property of the project. Use in a way that implies official endorsement without permission is not authorized.",
    },
    {
      heading: "Website content & documentation",
      body: "Original text, design, and documentation on this website are the property of Meridian Protocol unless otherwise credited.",
    },
    {
      heading: "Source code",
      body: "Licensing terms for any published source code are defined in the LICENSE file of the relevant GitHub repository — that file governs, not this page.",
    },
    {
      heading: "Third-party content",
      body: "This site does not claim ownership over any third-party material it references or links to. Attribution is provided where content is not original.",
    },
    {
      heading: "Reporting infringement",
      body: "To report suspected infringement of Meridian's IP, or to flag content on this site that may infringe someone else's rights, contact admin@meridianprotocol.site.",
    },
  ],
};

export const SECURITY_POLICY_GENERAL: LegalDoc = {
  eyebrow: "Security",
  title: "Meridian Security Policy",
  notice:
    "Draft — describes current security practices. Update this page as practices mature, not before.",
  sections: [
    {
      heading: "Security principles",
      body: "Prefer verifiable, on-chain facts over claims; disclose what has and hasn't been reviewed; treat every credential as compromised the moment it's exposed.",
    },
    {
      heading: "Smart-contract security",
      body: "The MRDN token contract has no owner, mint, pause, or blacklist function — removing an entire class of admin-key risk by design. An independent manual audit has not yet been completed.",
    },
    {
      heading: "Infrastructure security",
      body: "The website is deployed on Cloudflare Pages with security headers enforced at the edge where configured.",
    },
    {
      heading: "Website security",
      body: "The site is primarily static with no custodial backend or login system for end users, which removes common server-side attack surfaces.",
    },
    {
      heading: "Access control",
      body: "Deployment access is limited to the project maintainer's GitHub and Cloudflare accounts, both expected to use two-factor authentication.",
    },
    {
      heading: "Secret management",
      body: "No secrets are committed to the repository. Deployment credentials are stored as encrypted CI/CD secrets, not in code.",
    },
    {
      heading: "Responsible disclosure",
      body: "To report a security issue, contact admin@meridianprotocol.site. Do not publicly disclose vulnerabilities until the project has had a reasonable chance to respond.",
    },
  ],
};

export const COOKIE_POLICY: LegalDoc = {
  eyebrow: "Legal",
  title: "Cookie Policy",
  notice: "This site does not set its own advertising cookies. Update this page if that changes.",
  sections: [
    {
      heading: "Current state",
      body: "Meridian Protocol's website does not use first-party advertising cookies or third-party ad trackers.",
    },
    {
      heading: "Hosting-level data",
      body: "The hosting provider (Cloudflare Pages) may use technical mechanisms necessary to serve the site securely and efficiently. See the Privacy Policy for details on server logs.",
    },
    {
      heading: "If this changes",
      body: "Should the site later introduce cookies (e.g. for functionality or analytics), this page will be updated first, with a clear description of what is set and why, before relying on them as a final policy.",
    },
  ],
};
