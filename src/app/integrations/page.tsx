import type { Metadata } from "next";
import { MarketingSubpage } from "@/components/marketing/MarketingSubpage";
import { integrationsPage } from "@/lib/marketing-pages";

export const metadata: Metadata = {
  title: "Integraciones | Nextport AI",
  description: "Conectores para correo, storage, ERP, BI, SAT, VUCEM, brokers y carriers dentro del flujo de import compliance.",
};

export default function IntegrationsPage() {
  return <MarketingSubpage page={integrationsPage} />;
}
