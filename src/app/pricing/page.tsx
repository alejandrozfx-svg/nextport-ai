import type { Metadata } from "next";
import { MarketingSubpage } from "@/components/marketing/MarketingSubpage";
import { pricingPage } from "@/lib/marketing-pages";

export const metadata: Metadata = {
  title: "Precios | Nextport AI",
  description: "Pricing por workspace y volumen documental para pilotos, equipos de importación y despliegues enterprise.",
};

export default function PricingPage() {
  return <MarketingSubpage page={pricingPage} />;
}
