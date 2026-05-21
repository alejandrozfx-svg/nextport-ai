import type { Metadata } from "next";
import { MarketingSubpage } from "@/components/marketing/MarketingSubpage";
import { platformPage } from "@/lib/marketing-pages";

export const metadata: Metadata = {
  title: "Plataforma | Nextport AI",
  description: "Control tower para convertir documentos de importación en operaciones auditables y listas para revisión humana.",
};

export default function PlatformPage() {
  return <MarketingSubpage page={platformPage} />;
}
