import DocumentPage from "@/components/DocumentPage";
import { DOCUMENTS } from "@/data/token";

export default function Litepaper() {
  return (
    <DocumentPage
      eyebrow="Documentation"
      title="Litepaper"
      description="Condensed overview of Meridian Protocol — what is live on-chain today, what is in development, and what remains planned. Not a solicitation to buy tokens."
      pages={DOCUMENTS.litepaper.pages}
      updated={DOCUMENTS.litepaper.updated}
      href={DOCUMENTS.litepaper.href}
      secondaryHref="/whitepaper"
      secondaryLabel="Read the full Whitepaper"
    />
  );
}
