import type { Metadata } from "next";
import { Navbar } from "@/components/sentinel/Navbar";
import { HeroSection } from "@/components/sentinel/HeroSection";

export const metadata: Metadata = {
  title: "Plataforma | Nextport AI",
  description:
    "Plataforma de Nextport AI — full-screen immersive landing with 3D Spline scene.",
};

export default function PlatformPage() {
  return (
    <div className="sentinel-theme bg-hero-bg min-h-screen font-sora antialiased">
      <Navbar />
      <HeroSection />
    </div>
  );
}
