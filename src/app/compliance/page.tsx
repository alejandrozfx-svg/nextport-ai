import type { Metadata } from "next";
import { MarketingSubpage } from "@/components/marketing/MarketingSubpage";
import { compliancePage } from "@/lib/marketing-pages";

export const metadata: Metadata = {
  title: "Cumplimiento | Nextport AI",
  description: "Import compliance para pedimento, VUCEM, CFDI, Carta Porte, valor aduana, origen y evidencia auditable.",
};

export default function CompliancePage() {
  return <MarketingSubpage page={compliancePage} />;
}
