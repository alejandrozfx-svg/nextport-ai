"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Inbox,
  FileText,
  BarChart3,
  Plug,
  Shield,
  GraduationCap,
  Settings,
  Bot,
  ChevronRight,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/ui/BrandMark";
import { Avatar } from "@/components/ui/Avatar";
import { useState, useEffect } from "react";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";

const integrationStatus = [
  { name: "SAT · VUCEM", status: "connected" as const },
  { name: "SAP S/4 HANA", status: "connected" as const },
  { name: "Aduanas Pacífico", status: "pending" as const },
];

interface SidebarProps {
  onAiClick?: () => void;
}

export function Sidebar({ onAiClick }: SidebarProps) {
  const pathname = usePathname();
  const { lang } = useLang();
  const [user, setUser] = useState<{ name: string; initials: string; role: string; photo?: string } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const u = localStorage.getItem("np_user");
        if (u) setUser(JSON.parse(u));
      } catch {}
    }
  }, []);

  const navItems = [
    { href: "/console/pipeline",     labelKey: "pipeline"     as const, icon: Workflow },
    { href: "/console/operations",   labelKey: "operations"   as const, icon: Inbox },
    { href: "/console/documents",    labelKey: "documents"    as const, icon: FileText },
    { href: "/console/intelligence", labelKey: "intelligence" as const, icon: BarChart3 },
    { href: "/console/integrations", labelKey: "integrations" as const, icon: Plug },
    { href: "/console/security",     labelKey: "security"     as const, icon: Shield },
    { href: "/console/academy",      labelKey: "academy"      as const, icon: GraduationCap, badge: "NEW" },
    { href: "/console/settings",     labelKey: "settings"     as const, icon: Settings },
  ];

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col"
      style={{
        width: 240,
        background: "var(--bg-2)",
        borderRight: "1px solid var(--hair)",
        zIndex: 40,
      }}
    >
      {/* Brand */}
      <div className="px-4 py-4 flex-shrink-0" style={{ borderBottom: "1px solid var(--hair)" }}>
        <BrandMark />
        <p className="text-xs mt-0.5 font-mono" style={{ color: "var(--ink-4)" }}>
          {t("importControlTower", lang)}
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {navItems.map(({ href, labelKey, icon: Icon, badge }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all group relative",
                active ? "text-white" : "hover:opacity-100"
              )}
              style={
                active
                  ? {
                      background: "rgba(255,255,255,0.07)",
                      color: "var(--ink)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                    }
                  : { color: "var(--ink-3)" }
              }
            >
              <Icon size={16} className="flex-shrink-0" />
              <span className="flex-1">{t(labelKey, lang)}</span>
              {badge && (
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                  style={{ background: "var(--brand-soft)", color: "var(--brand)", fontSize: 10 }}
                >
                  {badge}
                </span>
              )}
              {active && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full"
                  style={{ background: "var(--brand)" }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Integration status — clickable, goes to Integrations page */}
      <div className="px-4 py-3 space-y-1" style={{ borderTop: "1px solid var(--hair)" }}>
        <p className="text-xs font-medium mb-1.5" style={{ color: "var(--ink-4)" }}>
          {t("integrationsSection", lang)}
        </p>
        {integrationStatus.map(({ name, status }) => (
          <Link
            key={name}
            href="/console/integrations"
            className="flex items-center gap-2 px-1.5 py-1 -mx-1.5 rounded transition-colors hover:bg-white/[0.04]"
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{
                background:
                  status === "connected"
                    ? "var(--ok)"
                    : status === "pending"
                    ? "var(--warn)"
                    : "var(--risk)",
              }}
            />
            <span className="text-xs truncate" style={{ color: "var(--ink-3)" }}>
              {name}
            </span>
          </Link>
        ))}
      </div>

      {/* AI Assistant card */}
      <button
        onClick={onAiClick}
        className="mx-3 mb-2 p-3 rounded-xl text-left transition-all hover:opacity-90"
        style={{
          background: "var(--brand-soft)",
          border: "1px solid oklch(0.78 0.09 235 / 0.2)",
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Bot size={14} style={{ color: "var(--brand)" }} />
          <span className="text-xs font-semibold" style={{ color: "var(--brand)" }}>
            {t("tutorName", lang)}
          </span>
          <ChevronRight size={12} style={{ color: "var(--brand)", marginLeft: "auto" }} />
        </div>
        <p className="text-xs" style={{ color: "var(--ink-3)" }}>
          {t("askComplianceShort", lang)}
        </p>
      </button>

      {/* User */}
      <div
        className="px-4 py-3 flex items-center gap-2.5"
        style={{ borderTop: "1px solid var(--hair)" }}
      >
        <Avatar
          initials={user?.initials ?? "DS"}
          src={user?.photo ?? "/users/diego-solorzano.jpg"}
          size="sm"
          alt={user?.name ?? "Diego Solórzano"}
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate" style={{ color: "var(--ink)" }}>
            {user?.name ?? "Diego Solórzano"}
          </p>
          <p className="text-xs truncate" style={{ color: "var(--ink-4)" }}>
            {user?.role ?? "Product Demo Owner"}
          </p>
        </div>
      </div>
    </aside>
  );
}
