import type { Metadata } from "next";
import { MarketingSubpage } from "@/components/marketing/MarketingSubpage";
import { platformPage } from "@/lib/marketing-pages";

export const metadata: Metadata = {
  title: "Plataforma | Nextport AI",
  description:
    "Control tower para convertir documentos de importación en operaciones auditables y listas para revisión humana.",
};

// Spline 3D scene used as the background only on /platform.
const SPLINE_SCENE = "https://prod.spline.design/Slk6b8kz3LRlKiyk/scene.splinecode";

export default function PlatformPage() {
  return <MarketingSubpage page={platformPage} splineScene={SPLINE_SCENE} />;
}
