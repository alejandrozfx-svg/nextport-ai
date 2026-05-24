"use client";

import { useState } from "react";
import { AppIcon } from "./AppIcon";

interface IntegrationLogoProps {
  name: string;
  slug: string;
  category?: string;
  size?: "sm" | "md";
}

const BRAND_STYLES: Record<string, {
  label: string;
  icon: string;
  bg: string;
  color: string;
  border: string;
  simpleIcon?: string;
}> = {
  gmail: { label: "G", icon: "mail", simpleIcon: "gmail/EA4335", bg: "linear-gradient(135deg, rgba(234,67,53,0.24), rgba(251,188,5,0.16), rgba(52,168,83,0.18))", color: "#F8D7D2", border: "rgba(234,67,53,0.36)" },
  outlook: { label: "O", icon: "mail", simpleIcon: "microsoftoutlook/0078D4", bg: "linear-gradient(135deg, rgba(0,120,212,0.30), rgba(44,160,232,0.16))", color: "#B9E2FF", border: "rgba(44,160,232,0.38)" },
  "ms-teams": { label: "T", icon: "users", simpleIcon: "microsoftteams/6264A7", bg: "linear-gradient(135deg, rgba(98,100,167,0.34), rgba(80,90,210,0.14))", color: "#D7D8FF", border: "rgba(122,124,220,0.38)" },
  slack: { label: "S", icon: "hash", simpleIcon: "slack/4A154B", bg: "linear-gradient(135deg, rgba(74,21,75,0.36), rgba(54,197,240,0.14), rgba(46,182,125,0.14))", color: "#F1D6FF", border: "rgba(180,120,190,0.35)" },
  whatsapp: { label: "W", icon: "message", simpleIcon: "whatsapp/25D366", bg: "linear-gradient(135deg, rgba(37,211,102,0.30), rgba(18,140,126,0.14))", color: "#BDF7D0", border: "rgba(37,211,102,0.40)" },
  gdrive: { label: "D", icon: "cloud", simpleIcon: "googledrive/4285F4", bg: "linear-gradient(135deg, rgba(66,133,244,0.22), rgba(251,188,5,0.14), rgba(52,168,83,0.16))", color: "#D5E7FF", border: "rgba(66,133,244,0.36)" },
  sharepoint: { label: "SP", icon: "cloud", simpleIcon: "microsoftsharepoint/0078D4", bg: "linear-gradient(135deg, rgba(3,120,124,0.30), rgba(0,170,180,0.12))", color: "#C9FBFF", border: "rgba(0,170,180,0.36)" },
  dropbox: { label: "Db", icon: "box", simpleIcon: "dropbox/0061FF", bg: "linear-gradient(135deg, rgba(0,97,255,0.28), rgba(0,160,255,0.10))", color: "#C9E0FF", border: "rgba(0,97,255,0.36)" },
  "sap-s4": { label: "SAP", icon: "database", simpleIcon: "sap/0FAAFF", bg: "linear-gradient(135deg, rgba(0,112,186,0.30), rgba(122,176,224,0.12))", color: "#BFE4FF", border: "rgba(122,176,224,0.38)" },
  netsuite: { label: "NS", icon: "database", simpleIcon: "oracle/F80000", bg: "linear-gradient(135deg, rgba(255,90,31,0.26), rgba(255,255,255,0.04))", color: "#FFD6C8", border: "rgba(255,120,80,0.32)" },
  dynamics365: { label: "D365", icon: "database", simpleIcon: "microsoftdynamics365/0B53CE", bg: "linear-gradient(135deg, rgba(0,120,212,0.28), rgba(80,90,210,0.12))", color: "#CBE7FF", border: "rgba(0,120,212,0.36)" },
  powerbi: { label: "BI", icon: "bar_chart", simpleIcon: "powerbi/F2C811", bg: "linear-gradient(135deg, rgba(242,200,17,0.28), rgba(222,160,0,0.10))", color: "#FFE999", border: "rgba(242,200,17,0.38)" },
  tableau: { label: "Tb", icon: "bar_chart", simpleIcon: "tableau/E97627", bg: "linear-gradient(135deg, rgba(64,140,220,0.24), rgba(255,130,60,0.12))", color: "#D2E7FF", border: "rgba(90,150,220,0.34)" },
  "sat-vucem": { label: "SAT", icon: "landmark", bg: "linear-gradient(135deg, rgba(28,132,114,0.26), rgba(255,255,255,0.04))", color: "#C6F7ED", border: "rgba(28,132,114,0.38)" },
  "sat-cfdi": { label: "SAT", icon: "landmark", bg: "linear-gradient(135deg, rgba(28,132,114,0.26), rgba(255,255,255,0.04))", color: "#C6F7ED", border: "rgba(28,132,114,0.38)" },
  vucem: { label: "VU", icon: "landmark", bg: "linear-gradient(135deg, rgba(28,132,114,0.22), rgba(122,176,224,0.10))", color: "#C6F7ED", border: "rgba(28,132,114,0.34)" },
  "aduanas-pacifico": { label: "AP", icon: "file", bg: "linear-gradient(135deg, rgba(122,176,224,0.22), rgba(255,255,255,0.03))", color: "var(--brand)", border: "oklch(0.78 0.09 235 / 0.34)" },
  adp: { label: "AP", icon: "file", bg: "linear-gradient(135deg, rgba(122,176,224,0.22), rgba(255,255,255,0.03))", color: "var(--brand)", border: "oklch(0.78 0.09 235 / 0.34)" },
  maersk: { label: "M", icon: "ship", simpleIcon: "maersk/42B0D5", bg: "linear-gradient(135deg, rgba(66,176,213,0.28), rgba(255,255,255,0.05))", color: "#CDEFFF", border: "rgba(66,176,213,0.38)" },
  dhl: { label: "DHL", icon: "truck", simpleIcon: "dhl/FFCC00", bg: "linear-gradient(135deg, rgba(255,204,0,0.28), rgba(212,5,17,0.12))", color: "#FFE999", border: "rgba(255,204,0,0.38)" },
  fedex: { label: "Fx", icon: "truck", simpleIcon: "fedex/4D148C", bg: "linear-gradient(135deg, rgba(78,40,145,0.30), rgba(255,102,0,0.16))", color: "#E7D8FF", border: "rgba(145,100,220,0.34)" },
};

function getBrandStyle({ name, slug, category }: IntegrationLogoProps) {
  if (BRAND_STYLES[slug]) return BRAND_STYLES[slug];
  if (category === "Customs & Logistics") {
    return { label: "A", icon: "file", bg: "linear-gradient(135deg, rgba(122,176,224,0.22), rgba(255,255,255,0.03))", color: "var(--brand)", border: "oklch(0.78 0.09 235 / 0.34)" };
  }
  return { label: name.slice(0, 2), icon: "building", bg: "var(--surface)", color: "var(--ink-2)", border: "var(--border-strong)" };
}

export function IntegrationLogo({ name, slug, category, size = "md" }: IntegrationLogoProps) {
  const [logoFailed, setLogoFailed] = useState(false);
  const brand = getBrandStyle({ name, slug, category });
  const showOfficialLogo = brand.simpleIcon && !logoFailed;
  const dimension = size === "sm" ? "h-9 w-9 rounded-lg" : "h-11 w-11 rounded-xl";
  const iconSize = size === "sm" ? 14 : 16;
  const imgSize = size === "sm" ? 18 : 22;

  return (
    <div
      className={`icon-tile ${dimension} flex-shrink-0`}
      style={{ background: brand.bg, borderColor: brand.border, color: brand.color }}
      aria-hidden="true"
    >
      {showOfficialLogo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://cdn.simpleicons.org/${brand.simpleIcon}`}
          alt=""
          width={imgSize}
          height={imgSize}
          onError={() => setLogoFailed(true)}
          style={{ display: "block", width: imgSize, height: imgSize, objectFit: "contain" }}
        />
      ) : (
        <div className="flex flex-col items-center gap-0.5">
          <AppIcon name={brand.icon} size={iconSize} />
          <span className="font-mono text-[9px] font-semibold leading-none">{brand.label}</span>
        </div>
      )}
    </div>
  );
}
