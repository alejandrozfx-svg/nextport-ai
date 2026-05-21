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
  Package,
  Route,
  Sparkles,
  Bot,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/ui/BrandMark";
import { Avatar } from "@/components/ui/Avatar";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/console/operations", label: "Operations", icon: Inbox },
  { href: "/console/documents", label: "Documents", icon: FileText },
  { href: "/console/intelligence", label: "Intelligence", icon: BarChart3 },
  { href: "/console/integrations", label: "Integrations", icon: Plug },
  { href: "/console/security", label: "Security & Audit", icon: Shield },
  { href: "/console/academy", label: "Academy", icon: GraduationCap, badge: "NEW" },
  { href: "/console/settings", label: "Settings", icon: Settings },
];

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
  const [user, setUser] = useState<{ name: string; initials: string; role: string } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const u = localStorage.getItem("np_user");
        if (u) setUser(JSON.parse(u));
      } catch {}
    }
  }, []);

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
          Import Control Tower
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon, badge }) => {
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
              <span className="flex-1">{label}</span>
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

      {/* Integration status */}
      <div className="px-4 py-3 space-y-2" style={{ borderTop: "1px solid var(--hair)" }}>
        <p className="text-xs font-medium mb-2" style={{ color: "var(--ink-4)" }}>
          INTEGRATIONS
        </p>
        {integrationStatus.map(({ name, status }) => (
          <div key={name} className="flex items-center gap-2">
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
          </div>
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
            Nextport Tutor
          </span>
          <ChevronRight size={12} style={{ color: "var(--brand)", marginLeft: "auto" }} />
        </div>
        <p className="text-xs" style={{ color: "var(--ink-3)" }}>
          Ask anything about trade compliance
        </p>
      </button>

      {/* User */}
      <div
        className="px-4 py-3 flex items-center gap-2.5"
        style={{ borderTop: "1px solid var(--hair)" }}
      >
        <Avatar initials={user?.initials ?? "AR"} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate" style={{ color: "var(--ink)" }}>
            {user?.name ?? "Alejandro Reyes"}
          </p>
          <p className="text-xs truncate" style={{ color: "var(--ink-4)" }}>
            {user?.role ?? "admin"}
          </p>
        </div>
      </div>
    </aside>
  );
}
